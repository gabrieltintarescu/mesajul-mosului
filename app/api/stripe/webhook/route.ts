import { inngest } from '@/lib/inngest';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// POST /api/stripe/webhook - Handle Stripe webhooks
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing stripe-signature header' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            Sentry.captureException(err, {
                extra: { context: 'Stripe webhook signature verification' },
            });
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Webhook signature verification failed' },
                { status: 400 }
            );
        }

        // Set Sentry context for this webhook
        Sentry.setContext('stripe_webhook', {
            eventType: event.type,
            eventId: event.id,
        });

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('Payment succeeded:', paymentIntent.id);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailed(paymentIntent);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        Sentry.captureException(error, {
            extra: { context: 'Stripe webhook handler' },
        });
        console.error('Error in Stripe webhook:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        Sentry.captureMessage('No orderId in checkout session metadata', {
            level: 'error',
            extra: { sessionId: session.id },
        });
        console.error('No orderId in checkout session metadata');
        return;
    }

    // Set Sentry context for this order
    Sentry.setTag('orderId', orderId);
    Sentry.setContext('checkout', {
        orderId,
        sessionId: session.id,
        paymentIntent: session.payment_intent,
    });

    // Get the order
    const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (fetchError || !order) {
        Sentry.captureMessage('Order not found during checkout completion', {
            level: 'error',
            extra: { orderId, fetchError },
        });
        console.error('Order not found:', orderId);
        return;
    }

    // Idempotency check: if order is not pending_payment, it was already processed
    // This prevents duplicate video generation, coupon increments, and emails on webhook retries
    if (order.status !== 'pending_payment') {
        console.log(`Order ${orderId} already processed (status: ${order.status}), skipping webhook`);
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: `Duplicate webhook skipped for order ${orderId}`,
            level: 'info',
            data: { currentStatus: order.status },
        });
        return;
    }

    // Update order status to paid
    const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
            status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

    if (updateError) {
        Sentry.captureException(updateError, {
            extra: { orderId, context: 'Failed to update order status to paid' },
        });
        console.error('Failed to update order status:', updateError);
        return;
    }

    // Increment coupon usage if applicable
    if (order.coupon_code) {
        await supabaseAdmin.rpc('increment_coupon_usage', {
            coupon_code: order.coupon_code,
        });
    }

    // Trigger video generation via Inngest background job
    await inngest.send({
        name: 'video/generate.requested',
        data: { orderId },
    });

    // Send payment confirmation email with invoice via Inngest
    await inngest.send({
        name: 'order/payment.completed',
        data: { orderId },
    });

    Sentry.addBreadcrumb({
        category: 'order',
        message: `Order ${orderId} payment completed, video generation triggered`,
        level: 'info',
    });

    console.log(`Order ${orderId} payment completed, video generation triggered via Inngest`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    // Note: paymentIntent.metadata may not contain orderId since we set metadata on checkout session
    // We need to look up the order by the payment intent ID stored during checkout completion
    // Or look up by finding the checkout session that created this payment intent

    let orderId = paymentIntent.metadata?.orderId;

    // If no orderId in payment intent metadata, try to find order by payment intent ID
    // (in case the checkout was completed but payment still failed later)
    if (!orderId) {
        const { data: order } = await supabaseAdmin
            .from('orders')
            .select('id')
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .single();

        if (order) {
            orderId = order.id;
        }
    }

    // If still no orderId, try to find order by looking up the checkout session
    if (!orderId) {
        try {
            // List checkout sessions that have this payment intent
            const sessions = await stripe.checkout.sessions.list({
                payment_intent: paymentIntent.id,
                limit: 1,
            });

            if (sessions.data.length > 0 && sessions.data[0].metadata?.orderId) {
                orderId = sessions.data[0].metadata.orderId;
            }
        } catch (error) {
            console.error('Failed to lookup checkout session for payment intent:', error);
        }
    }

    if (!orderId) {
        // Can't find the order - log and return
        console.log(`Payment failed but could not find associated order for payment intent: ${paymentIntent.id}`);
        return;
    }

    Sentry.captureMessage('Payment failed', {
        level: 'warning',
        extra: { orderId, paymentIntentId: paymentIntent.id },
    });

    // Only update if order is still in pending_payment status
    // (don't overwrite a paid or processing order if webhook arrives late)
    await supabaseAdmin
        .from('orders')
        .update({
            status: 'failed',
            error_message: 'Payment failed',
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .eq('status', 'pending_payment');
}

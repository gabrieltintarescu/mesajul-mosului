import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export interface CreateCheckoutRequest {
    orderId: string;
}

// POST /api/stripe/checkout - Create a Stripe checkout session
export async function POST(request: Request) {
    try {
        const body: CreateCheckoutRequest = await request.json();

        if (!body.orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Get the order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', body.orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Prevent checkout for already paid orders
        if (order.status !== 'pending_payment') {
            return NextResponse.json(
                { success: false, error: 'Order has already been paid' },
                { status: 400 }
            );
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: order.email,
            line_items: [
                {
                    price_data: {
                        currency: 'ron',
                        product_data: {
                            name: `Santa Video for ${order.child_details.name}`,
                            description: `Personalized Santa Claus video message for ${order.child_details.name}`,
                            images: ['https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=400'],
                        },
                        unit_amount: order.final_price,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orderId: order.id,
            },
            success_url: `${appUrl}/status-comanda/${order.id}?payment=success&email=${encodeURIComponent(order.email)}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/comanda/pas-3?orderId=${order.id}&payment=cancelled`,
        });

        // Store checkout session ID on order
        await supabaseAdmin
            .from('orders')
            .update({ stripe_checkout_session_id: session.id })
            .eq('id', order.id);

        return NextResponse.json({
            success: true,
            data: {
                sessionId: session.id,
                url: session.url,
            },
        });
    } catch (error) {
        console.error('Error in POST /api/stripe/checkout:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}

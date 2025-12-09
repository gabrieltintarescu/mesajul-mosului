import { inngest } from '@/lib/inngest';
import { isValidEmail, rateLimit } from '@/lib/security';
import { ChildDetails, InvoicingDetails } from '@/lib/supabase/database.types';
import { supabaseAdmin } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export interface CreateOrderRequest {
    email: string;
    childDetails: ChildDetails;
    invoicingDetails?: InvoicingDetails;
    couponCode?: string;
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
    // Rate limit: 5 orders per minute per IP
    const rateLimitResponse = rateLimit(request, { windowMs: 60000, maxRequests: 5 });
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const body: CreateOrderRequest = await request.json();

        // Validate required fields
        if (!body.email || !body.childDetails) {
            return NextResponse.json(
                { success: false, error: 'Email and child details are required' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!isValidEmail(body.email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate child details
        const { name, age, gender, achievements, favoriteThings, behavior } = body.childDetails;
        if (!name || !age || !gender || !achievements || !favoriteThings || !behavior) {
            return NextResponse.json(
                { success: false, error: 'All child details fields are required' },
                { status: 400 }
            );
        }

        // Get base price
        const basePrice = parseInt(process.env.VIDEO_PRICE_CENTS || '8900', 10);
        let discountAmount = 0;
        let finalPrice = basePrice;
        let validCouponCode: string | null = null;

        // Validate coupon if provided
        if (body.couponCode) {
            const { data: coupon, error: couponError } = await supabaseAdmin
                .from('coupons')
                .select('*')
                .eq('code', body.couponCode.toUpperCase())
                .eq('is_active', true)
                .single();

            if (couponError || !coupon) {
                return NextResponse.json(
                    { success: false, error: 'Invalid coupon code' },
                    { status: 400 }
                );
            }

            // Check if expired
            if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
                return NextResponse.json(
                    { success: false, error: 'Coupon has expired' },
                    { status: 400 }
                );
            }

            // Check max uses
            if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
                return NextResponse.json(
                    { success: false, error: 'Coupon usage limit reached' },
                    { status: 400 }
                );
            }

            // Calculate discount
            if (coupon.discount_percent > 0) {
                discountAmount = Math.round(basePrice * (coupon.discount_percent / 100));
            }
            if (coupon.discount_fixed > 0) {
                discountAmount += coupon.discount_fixed;
            }

            finalPrice = Math.max(0, basePrice - discountAmount);
            validCouponCode = coupon.code;
        }

        // Determine if this is a free order (100% discount)
        const isFreeOrder = finalPrice === 0;

        // Create order in database
        // For free orders, set status to 'paid' immediately since no payment is needed
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                email: body.email,
                child_details: body.childDetails,
                invoicing_details: body.invoicingDetails || null,
                status: isFreeOrder ? 'paid' : 'pending_payment',
                coupon_code: validCouponCode,
                discount_amount: discountAmount,
                final_price: finalPrice,
            })
            .select()
            .single();

        if (orderError || !order) {
            Sentry.captureException(orderError, {
                extra: { email: body.email, childName: body.childDetails?.name },
            });
            console.error('Error creating order:', orderError);
            return NextResponse.json(
                { success: false, error: 'Failed to create order' },
                { status: 500 }
            );
        }

        // Set Sentry context for the new order
        Sentry.setTag('orderId', order.id);
        Sentry.addBreadcrumb({
            category: 'order',
            message: `Order created: ${order.id}`,
            level: 'info',
            data: { email: body.email, finalPrice, isFreeOrder },
        });

        // For free orders: increment coupon usage and trigger video generation immediately
        if (isFreeOrder) {
            // Increment coupon usage since it was 100% off
            if (validCouponCode) {
                await supabaseAdmin.rpc('increment_coupon_usage', {
                    coupon_code: validCouponCode,
                });
            }

            // Trigger video generation immediately for free orders
            await inngest.send({
                name: 'video/generate.requested',
                data: { orderId: order.id },
            });

            // Send payment confirmation email (even for free orders)
            await inngest.send({
                name: 'order/payment.completed',
                data: { orderId: order.id },
            });

            Sentry.addBreadcrumb({
                category: 'order',
                message: `Free order ${order.id} - video generation triggered immediately`,
                level: 'info',
            });
        } else {
            // Trigger abandoned cart reminder (will be cancelled if payment completes)
            await inngest.send({
                name: 'order/created',
                data: { orderId: order.id },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                finalPrice,
                discountAmount,
                isFreeOrder,
            },
        });
    } catch (error) {
        Sentry.captureException(error, {
            extra: { context: 'POST /api/orders' },
        });
        console.error('Error in POST /api/orders:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

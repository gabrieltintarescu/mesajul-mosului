import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export interface ApplyCouponRequest {
    couponCode: string;
}

// POST /api/orders/[id]/apply-coupon - Apply a coupon to an existing order
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderId } = await params;
        const body: ApplyCouponRequest = await request.json();

        if (!body.couponCode) {
            return NextResponse.json(
                { success: false, error: 'Codul cuponului este obligatoriu' },
                { status: 400 }
            );
        }

        // Get the order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { success: false, error: 'Comanda nu a fost găsită' },
                { status: 404 }
            );
        }

        // Only allow coupon application for pending orders
        if (order.status !== 'pending_payment') {
            return NextResponse.json(
                { success: false, error: 'Nu se poate aplica un cupon pe o comandă plătită' },
                { status: 400 }
            );
        }

        const code = body.couponCode.toUpperCase().trim();

        // Look up coupon in database
        const { data: coupon, error: couponError } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', code)
            .eq('is_active', true)
            .single();

        if (couponError || !coupon) {
            return NextResponse.json(
                { success: false, error: 'Cod cupon invalid' },
                { status: 400 }
            );
        }

        // Check if expired
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json(
                { success: false, error: 'Acest cupon a expirat' },
                { status: 400 }
            );
        }

        // Check max uses
        if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
            return NextResponse.json(
                { success: false, error: 'Acest cupon a atins limita de utilizări' },
                { status: 400 }
            );
        }

        // Get base price (without any previous discount)
        const basePrice = parseInt(process.env.VIDEO_PRICE_CENTS || '8900', 10);

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discount_percent > 0) {
            discountAmount = Math.round(basePrice * (coupon.discount_percent / 100));
        }
        if (coupon.discount_fixed > 0) {
            discountAmount += coupon.discount_fixed;
        }

        const finalPrice = Math.max(0, basePrice - discountAmount);

        // Update order with coupon
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                coupon_code: coupon.code,
                discount_amount: discountAmount,
                final_price: finalPrice,
            })
            .eq('id', orderId);

        if (updateError) {
            console.error('Error updating order with coupon:', updateError);
            return NextResponse.json(
                { success: false, error: 'Nu s-a putut aplica cuponul' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                code: coupon.code,
                discountAmount,
                finalPrice,
                discountPercent: coupon.discount_percent,
                discountFixed: coupon.discount_fixed,
            },
        });
    } catch (error) {
        console.error('Error in POST /api/orders/[id]/apply-coupon:', error);
        return NextResponse.json(
            { success: false, error: 'Eroare internă de server' },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/[id]/apply-coupon - Remove coupon from an order
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderId } = await params;

        // Get the order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { success: false, error: 'Comanda nu a fost găsită' },
                { status: 404 }
            );
        }

        // Only allow coupon removal for pending orders
        if (order.status !== 'pending_payment') {
            return NextResponse.json(
                { success: false, error: 'Nu se poate modifica o comandă plătită' },
                { status: 400 }
            );
        }

        // Get base price
        const basePrice = parseInt(process.env.VIDEO_PRICE_CENTS || '8900', 10);

        // Update order to remove coupon
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                coupon_code: null,
                discount_amount: 0,
                final_price: basePrice,
            })
            .eq('id', orderId);

        if (updateError) {
            console.error('Error removing coupon from order:', updateError);
            return NextResponse.json(
                { success: false, error: 'Nu s-a putut elimina cuponul' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                finalPrice: basePrice,
            },
        });
    } catch (error) {
        console.error('Error in DELETE /api/orders/[id]/apply-coupon:', error);
        return NextResponse.json(
            { success: false, error: 'Eroare internă de server' },
            { status: 500 }
        );
    }
}

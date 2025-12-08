import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export interface ValidateCouponRequest {
    code: string;
}

// POST /api/coupons/validate - Validate a coupon code
export async function POST(request: Request) {
    try {
        const body: ValidateCouponRequest = await request.json();

        if (!body.code) {
            return NextResponse.json(
                { success: false, error: 'Coupon code is required' },
                { status: 400 }
            );
        }

        const code = body.code.toUpperCase().trim();

        // Look up coupon in database
        const { data: coupon, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', code)
            .eq('is_active', true)
            .single();

        if (error || !coupon) {
            return NextResponse.json(
                { success: false, error: 'Invalid coupon code' },
                { status: 400 }
            );
        }

        // Check if expired
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json(
                { success: false, error: 'This coupon has expired' },
                { status: 400 }
            );
        }

        // Check max uses
        if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
            return NextResponse.json(
                { success: false, error: 'This coupon has reached its usage limit' },
                { status: 400 }
            );
        }

        // Calculate discount
        const basePrice = parseInt(process.env.VIDEO_PRICE_CENTS || '2999', 10);
        let discountAmount = 0;

        if (coupon.discount_percent > 0) {
            discountAmount = Math.round(basePrice * (coupon.discount_percent / 100));
        }
        if (coupon.discount_fixed > 0) {
            discountAmount += coupon.discount_fixed;
        }

        const finalPrice = Math.max(0, basePrice - discountAmount);

        return NextResponse.json({
            success: true,
            data: {
                code: coupon.code,
                discountPercent: coupon.discount_percent,
                discountFixed: coupon.discount_fixed,
                discountAmount,
                originalPrice: basePrice,
                finalPrice,
            },
        });
    } catch (error) {
        console.error('Error in POST /api/coupons/validate:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

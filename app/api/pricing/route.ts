import { NextResponse } from 'next/server';

// GET /api/pricing - Get current pricing information
export async function GET() {
    // Base price in cents (bani)
    const basePriceCents = parseInt(process.env.VIDEO_PRICE_CENTS || '8900', 10);

    // Holiday discount in cents (bani) - can be configured via env
    const holidayDiscountCents = parseInt(process.env.HOLIDAY_DISCOUNT_CENTS || '0', 10);

    return NextResponse.json({
        success: true,
        data: {
            basePriceCents,
            holidayDiscountCents,
            finalPriceCents: Math.max(0, basePriceCents - holidayDiscountCents),
            // Also return in Lei for display
            basePriceLei: basePriceCents / 100,
            holidayDiscountLei: holidayDiscountCents / 100,
            finalPriceLei: Math.max(0, basePriceCents - holidayDiscountCents) / 100,
            currency: 'RON',
        },
    });
}

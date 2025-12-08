import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Get order by ID
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Transform snake_case to camelCase for frontend
        const transformedOrder = {
            id: order.id,
            email: order.email,
            childDetails: order.child_details,
            invoicingDetails: order.invoicing_details,
            status: order.status,
            videoUrl: order.video_url,
            script: order.script,
            couponCode: order.coupon_code,
            discountAmount: order.discount_amount,
            finalPrice: order.final_price,
            errorMessage: order.error_message,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
        };

        return NextResponse.json({
            success: true,
            data: { order: transformedOrder },
        });
    } catch (error) {
        console.error('Error in GET /api/orders/[id]:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

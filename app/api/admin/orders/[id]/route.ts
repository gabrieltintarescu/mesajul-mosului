import { verifyAdminToken } from '@/lib/security';
import { OrderRow, OrderStatus } from '@/lib/supabase/database.types';
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export interface UpdateOrderRequest {
    status?: OrderStatus;
    videoUrl?: string;
}

// PATCH /api/admin/orders/[id] - Update order
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !verifyAdminToken(authHeader)) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body: UpdateOrderRequest = await request.json();

        // Build update object
        const updateData: Partial<OrderRow> = {
            updated_at: new Date().toISOString(),
        };

        if (body.status) {
            updateData.status = body.status;
        }

        if (body.videoUrl) {
            updateData.video_url = body.videoUrl;
        }

        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                order: {
                    id: order.id,
                    email: order.email,
                    childDetails: order.child_details,
                    status: order.status,
                    videoUrl: order.video_url,
                    createdAt: order.created_at,
                    updatedAt: order.updated_at,
                },
            },
        });
    } catch (error) {
        console.error('Error in PATCH /api/admin/orders/[id]:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/admin/orders/[id] - Get single order details
export async function GET(request: Request, { params }: RouteParams) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !verifyAdminToken(authHeader)) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

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

        return NextResponse.json({
            success: true,
            data: {
                order: {
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
                },
            },
        });
    } catch (error) {
        console.error('Error in GET /api/admin/orders/[id]:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { OrderStatus } from '@/lib/supabase/database.types';
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/admin/orders - Get all orders with pagination
export async function GET(request: Request) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !verifyAdminToken(authHeader)) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
        const statusFilter = searchParams.get('status') as OrderStatus | null;

        // Build query
        let query = supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        // Paginate
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data: orders, error, count } = await query;

        if (error) {
            console.error('Error fetching orders:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch orders' },
                { status: 500 }
            );
        }

        // Transform orders for frontend
        const transformedOrders = orders?.map((order) => ({
            id: order.id,
            email: order.email,
            childDetails: order.child_details,
            status: order.status,
            videoUrl: order.video_url,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            paymentIntentId: order.stripe_payment_intent_id,
        }));

        return NextResponse.json({
            success: true,
            data: {
                orders: transformedOrders,
                total: count || 0,
                page,
                pageSize,
            },
        });
    } catch (error) {
        console.error('Error in GET /api/admin/orders:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function verifyAdminToken(authHeader: string): boolean {
    const token = authHeader.replace('Bearer ', '');
    // Simple token verification - in production, use JWT
    return token === 'admin_token_' + process.env.ADMIN_PASSWORD;
}

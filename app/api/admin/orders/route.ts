import { verifyAdminToken } from '@/lib/security';
import { OrderStatus } from '@/lib/supabase/database.types';
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/admin/orders - Get all orders with pagination, search, and filters
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
        const searchQuery = searchParams.get('search') || '';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build query
        let query = supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact' });

        // Apply status filter
        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        // Apply date range filter
        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        // Apply search - search in ID, email, and child name
        if (searchQuery) {
            // Use ilike for case-insensitive search on email
            // For ID and child_details.name, we need different approach
            query = query.or(
                `id.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,child_details->>name.ilike.%${searchQuery}%`
            );
        }

        // Apply sorting
        const ascending = sortOrder === 'asc';
        query = query.order(sortBy, { ascending });

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

        // Transform orders for frontend - include all details
        const transformedOrders = orders?.map((order) => ({
            id: order.id,
            email: order.email,
            childDetails: order.child_details,
            invoicingDetails: order.invoicing_details,
            status: order.status,
            videoUrl: order.video_url,
            script: order.script,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            paymentIntentId: order.stripe_payment_intent_id,
            checkoutSessionId: order.stripe_checkout_session_id,
            couponCode: order.coupon_code,
            discountAmount: order.discount_amount,
            finalPrice: order.final_price,
            errorMessage: order.error_message,
        }));

        // Also get stats for the current filter
        const { data: statsData } = await supabaseAdmin
            .from('orders')
            .select('status, final_price');

        const stats = {
            total: statsData?.length || 0,
            completed: statsData?.filter(o => o.status === 'completed').length || 0,
            pending: statsData?.filter(o => !['completed', 'failed', 'pending_payment', 'expired'].includes(o.status)).length || 0,
            failed: statsData?.filter(o => o.status === 'failed').length || 0,
            revenue: statsData
                ?.filter(o => !['pending_payment', 'expired'].includes(o.status))
                .reduce((sum, o) => sum + (o.final_price || 0), 0) || 0,
        };

        return NextResponse.json({
            success: true,
            data: {
                orders: transformedOrders,
                total: count || 0,
                page,
                pageSize,
                stats,
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

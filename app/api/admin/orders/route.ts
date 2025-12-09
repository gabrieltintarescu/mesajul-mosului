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

        // Build base query
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

        // Apply sorting
        const ascending = sortOrder === 'asc';
        query = query.order(sortBy, { ascending });

        // For search, we need a different approach since Supabase doesn't support 
        // JSONB field search well in .or() filters
        let orders;
        let totalCount;

        if (searchQuery) {
            // When searching, fetch all orders matching filters and search server-side
            // This is simpler and more reliable for small-medium datasets
            const { data: allOrders, error } = await query;

            if (error) {
                console.error('Error fetching orders:', error);
                return NextResponse.json(
                    { success: false, error: 'Failed to fetch orders' },
                    { status: 500 }
                );
            }

            // Filter by search query (id, email, or child name)
            const searchLower = searchQuery.toLowerCase();
            const filteredOrders = allOrders?.filter(order => {
                const idMatch = order.id.toLowerCase().includes(searchLower);
                const emailMatch = order.email.toLowerCase().includes(searchLower);
                const childName = order.child_details?.name?.toLowerCase() || '';
                const nameMatch = childName.includes(searchLower);
                return idMatch || emailMatch || nameMatch;
            }) || [];

            totalCount = filteredOrders.length;

            // Apply pagination to filtered results
            const from = (page - 1) * pageSize;
            orders = filteredOrders.slice(from, from + pageSize);
        } else {
            // No search - use database pagination
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) {
                console.error('Error fetching orders:', error);
                return NextResponse.json(
                    { success: false, error: 'Failed to fetch orders' },
                    { status: 500 }
                );
            }

            orders = data;
            totalCount = count || 0;
        }

        // Transform orders for frontend - include all details
        const transformedOrders = orders?.map((order) => ({
            id: order.id,
            email: order.email,
            childDetails: order.child_details,
            invoicingDetails: order.invoicing_details,
            status: order.status,
            videoUrl: order.video_url,
            invoiceUrl: order.invoice_url,
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
                total: totalCount,
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

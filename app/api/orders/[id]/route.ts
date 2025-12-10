import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Get order by ID
// Requires email query param for verification (prevents order enumeration)
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Require email for verification to prevent order ID enumeration
        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Verificarea email-ului este necesară' },
                { status: 400 }
            );
        }

        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { success: false, error: 'Comanda nu a fost găsită' },
                { status: 404 }
            );
        }

        // Verify email matches the order (case-insensitive)
        if (order.email.toLowerCase() !== email.toLowerCase()) {
            // Return same error as "not found" to prevent enumeration
            return NextResponse.json(
                { success: false, error: 'Comanda nu a fost găsită' },
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
            { success: false, error: 'Eroare internă de server' },
            { status: 500 }
        );
    }
}

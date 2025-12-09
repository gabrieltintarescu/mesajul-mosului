import { verifyAdminToken } from '@/lib/security';
import { generateInvoicePdf } from '@/lib/services/invoice';
import { supabaseAdmin } from '@/lib/supabase/server';
import JSZip from 'jszip';
import { NextResponse } from 'next/server';

// GET /api/admin/invoices - Get invoice(s) for order(s)
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
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Get order from database
        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Generate PDF
        const pdfBuffer = await generateInvoicePdf(order);

        // Return PDF as download
        return new Response(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="factura-${orderId.slice(0, 8)}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating invoice:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate invoice' },
            { status: 500 }
        );
    }
}

// POST /api/admin/invoices - Bulk download invoices by period or order IDs
export async function POST(request: Request) {
    try {
        // Verify admin token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !verifyAdminToken(authHeader)) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { orderIds, startDate, endDate } = body;

        let ordersToProcess;

        if (orderIds && orderIds.length > 0) {
            // Fetch specific orders
            const { data, error } = await supabaseAdmin
                .from('orders')
                .select('*')
                .in('id', orderIds)
                .not('status', 'eq', 'pending_payment');

            if (error) {
                console.error('Error fetching orders:', error);
                return NextResponse.json(
                    { success: false, error: 'Failed to fetch orders' },
                    { status: 500 }
                );
            }
            ordersToProcess = data;
        } else if (startDate && endDate) {
            // Fetch orders by date range
            const { data, error } = await supabaseAdmin
                .from('orders')
                .select('*')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .not('status', 'eq', 'pending_payment')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
                return NextResponse.json(
                    { success: false, error: 'Failed to fetch orders' },
                    { status: 500 }
                );
            }
            ordersToProcess = data;
        } else {
            return NextResponse.json(
                { success: false, error: 'Either orderIds or date range is required' },
                { status: 400 }
            );
        }

        if (!ordersToProcess || ordersToProcess.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No orders found for the given criteria' },
                { status: 404 }
            );
        }

        // Generate ZIP with all invoices
        const zip = new JSZip();
        const invoicesFolder = zip.folder('facturi');

        for (const order of ordersToProcess) {
            try {
                const pdfBuffer = await generateInvoicePdf(order);
                const dateStr = new Date(order.created_at).toISOString().split('T')[0];
                invoicesFolder?.file(
                    `factura-${order.id.slice(0, 8)}-${dateStr}.pdf`,
                    pdfBuffer
                );
            } catch (err) {
                console.error(`Error generating invoice for order ${order.id}:`, err);
            }
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        // Return ZIP as download
        const dateRangeStr = startDate && endDate
            ? `${startDate.split('T')[0]}_${endDate.split('T')[0]}`
            : 'selectate';

        return new Response(new Uint8Array(zipBuffer), {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="facturi-${dateRangeStr}.zip"`,
            },
        });
    } catch (error) {
        console.error('Error generating bulk invoices:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate invoices' },
            { status: 500 }
        );
    }
}

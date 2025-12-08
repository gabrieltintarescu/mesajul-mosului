import { sendVideoReadyEmail } from '@/lib/services/email';
import { createHeyGenVideo, waitForHeyGenVideo } from '@/lib/services/heygen';
import { generateSantaScript } from '@/lib/services/openai';
import { processVideo } from '@/lib/services/video';
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export interface GenerateVideoRequest {
    orderId: string;
}

// Verify internal API key for protected endpoints
function verifyInternalApiKey(request: Request): boolean {
    const apiKey = request.headers.get('x-api-key');
    const internalKey = process.env.INTERNAL_API_KEY;
    
    // If no internal key is set, reject all requests (fail secure)
    if (!internalKey) {
        console.error('INTERNAL_API_KEY is not set - rejecting request');
        return false;
    }
    
    return apiKey === internalKey;
}

// POST /api/video/generate - Generate video for an order
// This is the main video generation worker that handles the entire pipeline
// PROTECTED: Requires INTERNAL_API_KEY header
export async function POST(request: Request) {
    // Verify internal API key - this endpoint should only be called by trusted services
    if (!verifyInternalApiKey(request)) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    let orderId: string | null = null;

    try {
        const body: GenerateVideoRequest = await request.json();
        orderId = body.orderId;

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Get the order
        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Only process paid orders
        if (order.status !== 'paid') {
            return NextResponse.json(
                { success: false, error: 'Order is not in paid status' },
                { status: 400 }
            );
        }

        console.log(`Starting video generation for order ${orderId}`);

        // Step 1: Generate script with ChatGPT
        await updateOrderStatus(orderId, 'generating_script');
        const script = await generateSantaScript(order.child_details);

        await supabaseAdmin
            .from('orders')
            .update({ script })
            .eq('id', orderId);

        console.log(`Script generated for order ${orderId}`);

        // Step 2: Generate video with HeyGen
        await updateOrderStatus(orderId, 'generating_video');
        const heygenVideoId = await createHeyGenVideo(script);

        await supabaseAdmin
            .from('orders')
            .update({ heygen_video_id: heygenVideoId })
            .eq('id', orderId);

        console.log(`HeyGen video created for order ${orderId}, video_id: ${heygenVideoId}`);

        // Step 3: Wait for HeyGen video to complete
        const heygenVideoUrl = await waitForHeyGenVideo(heygenVideoId);
        console.log(`HeyGen video completed for order ${orderId}`);

        // Step 4: Process video (download and upload to Supabase Storage)
        await updateOrderStatus(orderId, 'merging');
        const finalVideoUrl = await processVideo(heygenVideoUrl, orderId);
        console.log(`Video processed and uploaded for order ${orderId}`);

        // Step 5: Mark as completed
        await supabaseAdmin
            .from('orders')
            .update({
                status: 'completed',
                video_url: finalVideoUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

        console.log(`Order ${orderId} completed!`);

        // Step 6: Send email notification
        try {
            await sendVideoReadyEmail({
                to: order.email,
                childName: order.child_details.name,
                videoUrl: finalVideoUrl,
                orderId: order.id,
            });
            console.log(`Email sent for order ${orderId}`);
        } catch (emailError) {
            console.error('Failed to send video ready email:', emailError);
            // Don't fail the order if email fails
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId,
                videoUrl: finalVideoUrl,
            },
        });
    } catch (error) {
        console.error('Error in video generation:', error);

        // Update order to failed status
        if (orderId) {
            await supabaseAdmin
                .from('orders')
                .update({
                    status: 'failed',
                    error_message: error instanceof Error ? error.message : 'Unknown error',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', orderId);
        }

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Video generation failed'
            },
            { status: 500 }
        );
    }
}

async function updateOrderStatus(orderId: string, status: string) {
    await supabaseAdmin
        .from('orders')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
}

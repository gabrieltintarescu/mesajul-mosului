import { sendPaymentConfirmationEmail, sendPaymentLinkEmail, sendVideoReadyEmail } from '@/lib/services/email';
import { createHeyGenVideo, getHeyGenVideoStatus } from '@/lib/services/heygen';
import { generateInvoicePdf } from '@/lib/services/invoice';
import { generateSantaScript } from '@/lib/services/openai';
import { processVideoWithAssets } from '@/lib/services/video';
import { supabaseAdmin } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';
import { inngest } from './client';

// Define the event type
type VideoGenerationEvent = {
    name: 'video/generate.requested';
    data: {
        orderId: string;
    };
};

/**
 * Background job for video generation pipeline
 * 
 * This function handles the entire video generation process:
 * 1. Generate script with ChatGPT
 * 2. Create video with HeyGen
 * 3. Wait for HeyGen completion (with polling)
 * 4. Download intro, main video, outro
 * 5. Concatenate with FFmpeg
 * 6. Upload final video to Supabase
 * 7. Send email notification
 */
export const videoGenerationJob = inngest.createFunction(
    {
        id: 'video-generation',
        name: 'Video Generation Pipeline',
        retries: 2,
        onFailure: async ({ error, event }) => {
            // The original event data is nested in the failure event
            const orderId = (event.data as { event?: { data?: { orderId?: string } } }).event?.data?.orderId;

            // Report failure to Sentry with full context
            Sentry.withScope((scope) => {
                scope.setTag('job', 'video-generation');
                if (orderId) {
                    scope.setTag('orderId', orderId);
                }
                scope.setContext('event', event);
                Sentry.captureException(error);
            });

            // Update order status to failed
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
        },
    },
    { event: 'video/generate.requested' },
    async ({ event, step }) => {
        const { orderId } = event.data;

        // Set Sentry context for all errors in this job
        Sentry.setTag('orderId', orderId);
        Sentry.setContext('order', { orderId });

        // Step 1: Get order details
        const order = await step.run('fetch-order', async () => {
            const { data, error } = await supabaseAdmin
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error || !data) {
                throw new Error(`Order not found: ${orderId}`);
            }

            // Add order details to Sentry context
            Sentry.setContext('orderDetails', {
                email: data.email,
                childName: data.child_details?.name,
                status: data.status,
            });

            return data;
        });

        // Step 2: Generate script with ChatGPT
        const script = await step.run('generate-script', async () => {
            await supabaseAdmin
                .from('orders')
                .update({ status: 'generating_script', updated_at: new Date().toISOString() })
                .eq('id', orderId);

            const generatedScript = await generateSantaScript(order.child_details);

            await supabaseAdmin
                .from('orders')
                .update({ script: generatedScript })
                .eq('id', orderId);

            return generatedScript;
        });

        // Step 3: Create HeyGen video task
        const heygenVideoId = await step.run('create-heygen-video', async () => {
            Sentry.addBreadcrumb({
                category: 'video',
                message: 'Starting HeyGen video creation',
                level: 'info',
            });

            await supabaseAdmin
                .from('orders')
                .update({ status: 'generating_video', updated_at: new Date().toISOString() })
                .eq('id', orderId);

            const videoId = await createHeyGenVideo(script);

            await supabaseAdmin
                .from('orders')
                .update({ heygen_video_id: videoId })
                .eq('id', orderId);

            Sentry.setContext('heygen', { videoId });

            return videoId;
        });

        // Step 4: Poll for HeyGen completion (using step.sleep for efficient waiting)
        const heygenVideoUrl = await step.run('wait-for-heygen', async () => {
            const maxAttempts = 60; // 10 minutes with 10 second intervals

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const status = await getHeyGenVideoStatus(heygenVideoId);

                Sentry.addBreadcrumb({
                    category: 'video',
                    message: `HeyGen status check ${attempt + 1}/${maxAttempts}: ${status.status}`,
                    level: 'info',
                });

                if (status.status === 'completed' && status.videoUrl) {
                    return status.videoUrl;
                }

                if (status.status === 'failed') {
                    const error = new Error(`HeyGen video generation failed: ${status.error || 'Unknown error'}`);
                    Sentry.captureException(error, {
                        extra: { heygenVideoId, attempt, status },
                    });
                    throw error;
                }

                // Wait 10 seconds before next check
                await new Promise(resolve => setTimeout(resolve, 10000));
            }

            const error = new Error('HeyGen video generation timed out');
            Sentry.captureException(error, {
                extra: { heygenVideoId, maxAttempts },
            });
            throw error;
        });

        // Step 5: Process video with intro/outro concatenation
        const finalVideoUrl = await step.run('process-video', async () => {
            Sentry.addBreadcrumb({
                category: 'video',
                message: 'Starting video processing with intro/outro',
                level: 'info',
            });

            await supabaseAdmin
                .from('orders')
                .update({ status: 'merging', updated_at: new Date().toISOString() })
                .eq('id', orderId);

            // Process video with optional intro/outro (uses Shotstack if configured)
            const publicUrl = await processVideoWithAssets(heygenVideoUrl, orderId);

            Sentry.addBreadcrumb({
                category: 'video',
                message: 'Video processing completed',
                level: 'info',
                data: { publicUrl },
            });

            return publicUrl;
        });

        // Step 6: Mark as completed
        await step.run('complete-order', async () => {
            await supabaseAdmin
                .from('orders')
                .update({
                    status: 'completed',
                    video_url: finalVideoUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', orderId);

            Sentry.addBreadcrumb({
                category: 'order',
                message: 'Order marked as completed',
                level: 'info',
            });
        });

        // Step 7: Send email notification
        await step.run('send-email', async () => {
            Sentry.addBreadcrumb({
                category: 'email',
                message: `Sending email to ${order.email}`,
                level: 'info',
            });

            await sendVideoReadyEmail({
                to: order.email,
                childName: order.child_details.name,
                videoUrl: finalVideoUrl,
                orderId: orderId,
            });

            Sentry.addBreadcrumb({
                category: 'email',
                message: 'Email sent successfully',
                level: 'info',
            });
        });

        return { success: true, videoUrl: finalVideoUrl };
    }
);

/**
 * Payment link email - sends email immediately after order creation with payment link
 * If user completes payment, the link simply won't work twice (Stripe handles this)
 */
export const paymentLinkEmail = inngest.createFunction(
    {
        id: 'payment-link-email',
        name: 'Payment Link Email',
    },
    { event: 'order/created' },
    async ({ event, step }) => {
        const { orderId } = event.data;

        // Get order details
        const order = await step.run('fetch-order', async () => {
            const { data, error } = await supabaseAdmin
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error || !data) {
                return null;
            }

            return data;
        });

        // If order doesn't exist, skip
        if (!order) {
            return { skipped: true, reason: 'Order not found' };
        }

        // Send payment link email immediately
        await step.run('send-payment-link-email', async () => {
            await sendPaymentLinkEmail({
                to: order.email,
                childName: order.child_details.name,
                orderId: order.id,
            });

            Sentry.addBreadcrumb({
                category: 'email',
                message: `Payment link email sent to ${order.email}`,
                level: 'info',
            });
        });

        return { success: true, emailSent: true };
    }
);

/**
 * Payment completed handler - sends confirmation email with invoice PDF
 * Triggered when payment is successfully processed
 */
export const paymentCompletedEmail = inngest.createFunction(
    {
        id: 'payment-completed-email',
        name: 'Payment Completed Email with Invoice',
    },
    { event: 'order/payment.completed' },
    async ({ event, step }) => {
        const { orderId } = event.data;

        // Get order details
        const order = await step.run('fetch-order', async () => {
            const { data, error } = await supabaseAdmin
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error || !data) {
                return null;
            }

            return data;
        });

        // If order doesn't exist, skip
        if (!order) {
            return { skipped: true, reason: 'Order not found' };
        }

        // Generate invoice PDF and send email in the same step
        // (Buffer cannot be serialized between steps)
        const result = await step.run('generate-invoice-and-send-email', async () => {
            let invoicePdf: Buffer | undefined;

            try {
                invoicePdf = await generateInvoicePdf(order);
            } catch (error) {
                Sentry.captureException(error, {
                    extra: { orderId, context: 'Failed to generate invoice PDF' },
                });
                console.error('Failed to generate invoice PDF:', error);
            }

            // Send payment confirmation email with invoice
            await sendPaymentConfirmationEmail({
                to: order.email,
                childName: order.child_details.name,
                orderId: order.id,
                invoicePdf,
            });

            Sentry.addBreadcrumb({
                category: 'email',
                message: `Payment confirmation email sent to ${order.email}`,
                level: 'info',
            });

            return { emailSent: true, invoiceGenerated: !!invoicePdf };
        });

        return { success: true, ...result };
    }
);

// Export all functions for the Inngest handler
export const functions = [videoGenerationJob, paymentLinkEmail, paymentCompletedEmail];

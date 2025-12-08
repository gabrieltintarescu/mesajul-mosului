import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Download a video from URL and return as Buffer
 */
export async function downloadVideo(url: string): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * Upload video to Supabase Storage
 */
export async function uploadToSupabase(
    buffer: Buffer,
    fileName: string
): Promise<string> {
    const { error } = await supabaseAdmin.storage
        .from('videos')
        .upload(fileName, buffer, {
            contentType: 'video/mp4',
            upsert: true,
        });

    if (error) {
        throw new Error(`Failed to upload video: ${error.message}`);
    }

    // Get public URL
    const { data } = supabaseAdmin.storage.from('videos').getPublicUrl(fileName);

    return data.publicUrl;
}

/**
 * Process video - download from HeyGen and upload to our Supabase storage
 * 
 * Note: If you need intro/outro, use HeyGen templates instead of post-processing.
 * Set HEYGEN_TEMPLATE_ID in your environment to use a template that includes
 * intro/outro scenes. This is more efficient than concatenating videos.
 */
export async function processVideo(
    heygenVideoUrl: string,
    orderId: string
): Promise<string> {
    // Download the video from HeyGen
    const videoBuffer = await downloadVideo(heygenVideoUrl);

    // Upload to our Supabase storage for permanence
    const fileName = `orders/${orderId}/santa-video.mp4`;
    const publicUrl = await uploadToSupabase(videoBuffer, fileName);

    return publicUrl;
}

/**
 * Alias for processVideo - kept for backwards compatibility
 */
export async function processVideoWithAssets(
    heygenVideoUrl: string,
    orderId: string
): Promise<string> {
    return processVideo(heygenVideoUrl, orderId);
}

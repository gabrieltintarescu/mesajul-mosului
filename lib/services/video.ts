import { supabaseAdmin } from '@/lib/supabase/server';

const SHOTSTACK_API_BASE = 'https://api.shotstack.io/v1';

interface VideoAssets {
    introUrl: string;
    outroUrl: string;
}

/**
 * Get intro and outro video URLs from Supabase
 */
export async function getVideoAssets(): Promise<VideoAssets | null> {
    const { data: assets, error } = await supabaseAdmin
        .from('video_assets')
        .select('*')
        .in('type', ['intro', 'outro']);

    if (error) {
        console.error('Failed to fetch video assets:', error.message);
        return null;
    }

    const intro = assets?.find((a: { type: string }) => a.type === 'intro');
    const outro = assets?.find((a: { type: string }) => a.type === 'outro');

    if (!intro || !outro) {
        console.log('Intro or outro video assets not configured');
        return null;
    }

    return {
        introUrl: intro.video_url,
        outroUrl: outro.video_url,
    };
}

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
 * Concatenate videos using Shotstack API (cloud video processing)
 * This works in serverless environments like Vercel
 */
export async function concatenateVideosWithShotstack(
    introUrl: string,
    mainVideoUrl: string,
    outroUrl: string
): Promise<string> {
    const apiKey = process.env.SHOTSTACK_API_KEY;

    if (!apiKey) {
        throw new Error('SHOTSTACK_API_KEY not configured');
    }

    // Create Shotstack edit timeline
    const timeline = {
        timeline: {
            tracks: [
                {
                    clips: [
                        {
                            asset: { type: 'video', src: introUrl },
                            start: 0,
                            length: 'auto',
                        },
                        {
                            asset: { type: 'video', src: mainVideoUrl },
                            start: 'auto',
                            length: 'auto',
                        },
                        {
                            asset: { type: 'video', src: outroUrl },
                            start: 'auto',
                            length: 'auto',
                        },
                    ],
                },
            ],
        },
        output: {
            format: 'mp4',
            resolution: 'hd',
        },
    };

    // Submit render job
    const renderResponse = await fetch(`${SHOTSTACK_API_BASE}/render`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify(timeline),
    });

    if (!renderResponse.ok) {
        const error = await renderResponse.text();
        throw new Error(`Shotstack render failed: ${error}`);
    }

    const renderData = await renderResponse.json();
    const renderId = renderData.response.id;

    // Poll for completion
    const maxAttempts = 60; // 5 minutes with 5 second intervals
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000));

        const statusResponse = await fetch(`${SHOTSTACK_API_BASE}/render/${renderId}`, {
            headers: { 'x-api-key': apiKey },
        });

        const statusData = await statusResponse.json();
        const status = statusData.response.status;

        if (status === 'done') {
            return statusData.response.url;
        }

        if (status === 'failed') {
            throw new Error('Shotstack render failed');
        }
    }

    throw new Error('Shotstack render timed out');
}

/**
 * Simple concatenation by storing video URLs in order
 * The final video URL is stored with metadata about the composition
 * This approach lets the client play videos in sequence
 */
export interface VideoComposition {
    introUrl?: string;
    mainVideoUrl: string;
    outroUrl?: string;
    combinedUrl?: string;
}

/**
 * Process and concatenate videos
 * If Shotstack is configured, uses cloud processing
 * Otherwise, stores individual video URLs for client-side playback
 */
export async function concatenateVideos(
    introUrl: string,
    mainBuffer: Buffer,
    outroUrl: string,
    orderId: string
): Promise<string> {
    // First, upload the main video to get a URL
    const mainFileName = `orders/${orderId}/main-video.mp4`;
    const mainVideoUrl = await uploadToSupabase(mainBuffer, mainFileName);

    // Check if Shotstack is configured for server-side concatenation
    if (process.env.SHOTSTACK_API_KEY) {
        try {
            const concatenatedUrl = await concatenateVideosWithShotstack(
                introUrl,
                mainVideoUrl,
                outroUrl
            );

            // Download and re-upload to our storage
            const finalBuffer = await downloadVideo(concatenatedUrl);
            const finalFileName = `orders/${orderId}/santa-video-final.mp4`;
            return await uploadToSupabase(finalBuffer, finalFileName);
        } catch (error) {
            console.error('Shotstack concatenation failed, using main video only:', error);
            return mainVideoUrl;
        }
    }

    // If no Shotstack, just return the main video URL
    // Store composition info in order metadata for client-side playback
    return mainVideoUrl;
}

/**
 * Simple video processing - download from source and upload to our storage
 */
export async function processVideo(
    heygenVideoUrl: string,
    orderId: string
): Promise<string> {
    // Download and re-upload to our storage for permanence
    const videoBuffer = await downloadVideo(heygenVideoUrl);
    const fileName = `orders/${orderId}/santa-video.mp4`;
    const publicUrl = await uploadToSupabase(videoBuffer, fileName);

    return publicUrl;
}

/**
 * Full video processing with optional intro/outro concatenation
 */
export async function processVideoWithAssets(
    heygenVideoUrl: string,
    orderId: string
): Promise<string> {
    // Download the HeyGen video
    const mainBuffer = await downloadVideo(heygenVideoUrl);

    // Get video assets (intro/outro)
    const assets = await getVideoAssets();

    if (assets) {
        // Concatenate with intro/outro
        return await concatenateVideos(
            assets.introUrl,
            mainBuffer,
            assets.outroUrl,
            orderId
        );
    }

    // No assets, just upload main video
    const fileName = `orders/${orderId}/santa-video.mp4`;
    return await uploadToSupabase(mainBuffer, fileName);
}

const HEYGEN_API_BASE = 'https://api.heygen.com';

interface HeyGenVideoResponse {
    code: number;
    data: {
        video_id: string;
    };
    message: string;
}

interface HeyGenVideoStatusResponse {
    code: number;
    data: {
        video_id: string;
        status: 'pending' | 'processing' | 'completed' | 'failed';
        video_url?: string;
        thumbnail_url?: string;
        duration?: number;
        error?: string;
    };
    message: string;
}

async function heygenFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${HEYGEN_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'X-Api-Key': process.env.HEYGEN_API_KEY!,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HeyGen API error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

/**
 * Create a video generation task with HeyGen
 */
export async function createHeyGenVideo(script: string): Promise<string> {
    const avatarId = process.env.HEYGEN_AVATAR_ID;
    const voiceId = process.env.HEYGEN_VOICE_ID;

    if (!avatarId || !voiceId) {
        throw new Error('HEYGEN_AVATAR_ID and HEYGEN_VOICE_ID must be configured');
    }

    const payload = {
        video_inputs: [
            {
                character: {
                    type: 'avatar',
                    avatar_id: avatarId,
                    avatar_style: 'normal',
                },
                voice: {
                    type: 'text',
                    input_text: script,
                    voice_id: voiceId,
                    language: 'Romanian', // Romanian language output
                },
                background: {
                    type: 'color',
                    value: '#1a472a', // Christmas green background
                },
            },
        ],
        dimension: {
            width: 1280,
            height: 720,
        },
        aspect_ratio: '16:9',
        test: false,
    };

    const response = await heygenFetch<HeyGenVideoResponse>('/v2/video/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (response.code !== 100) {
        throw new Error(`HeyGen video creation failed: ${response.message}`);
    }

    return response.data.video_id;
}

/**
 * Check the status of a HeyGen video generation task
 */
export async function getHeyGenVideoStatus(
    videoId: string
): Promise<{ status: string; videoUrl?: string; error?: string }> {
    const response = await heygenFetch<HeyGenVideoStatusResponse>(
        `/v1/video_status.get?video_id=${videoId}`
    );

    return {
        status: response.data.status,
        videoUrl: response.data.video_url,
        error: response.data.error,
    };
}

/**
 * Poll for video completion (with timeout)
 */
export async function waitForHeyGenVideo(
    videoId: string,
    maxWaitMs: number = 600000, // 10 minutes default
    pollIntervalMs: number = 10000 // 10 seconds
): Promise<string> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
        const status = await getHeyGenVideoStatus(videoId);

        if (status.status === 'completed' && status.videoUrl) {
            return status.videoUrl;
        }

        if (status.status === 'failed') {
            throw new Error(`HeyGen video generation failed: ${status.error || 'Unknown error'}`);
        }

        // Wait before next poll
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error('HeyGen video generation timed out');
}

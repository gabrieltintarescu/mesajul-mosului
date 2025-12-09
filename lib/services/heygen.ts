const HEYGEN_API_BASE = 'https://api.heygen.com';

interface HeyGenVideoResponse {
    code: number;
    data: {
        video_id: string;
    };
    message: string;
}

interface HeyGenTemplateVideoResponse {
    error: string | null;
    data: {
        video_id: string;
    };
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

    const responseText = await response.text();
    let responseJson: T;

    try {
        responseJson = JSON.parse(responseText);
    } catch {
        throw new Error(`HeyGen API error: ${response.status} - Invalid JSON response: ${responseText}`);
    }

    if (!response.ok) {
        throw new Error(`HeyGen API error: ${response.status} - ${responseText}`);
    }

    return responseJson;
}

/**
 * Create a video using a HeyGen template (recommended for intro/outro)
 * Template should have a variable called "script" for the Santa message
 * 
 * To set up your template:
 * 1. Go to HeyGen Dashboard → Templates → Create Template
 * 2. Add Scene 1: Your intro video/animation
 * 3. Add Scene 2: Santa avatar with text variable {{script}}
 * 4. Add Scene 3: Your outro video/animation
 * 5. Save and copy the Template ID to HEYGEN_TEMPLATE_ID env var
 */
export async function createHeyGenVideoFromTemplate(script: string): Promise<string> {
    const templateId = process.env.HEYGEN_TEMPLATE_ID;

    if (!templateId) {
        throw new Error('HEYGEN_TEMPLATE_ID must be configured for template-based generation');
    }

    const payload = {
        template_id: templateId,
        title: `Santa Video - ${new Date().toISOString()}`,
        variables: {
            // The script variable - must match the variable name in your template
            script: {
                name: 'script',
                type: 'text',
                properties: {
                    content: script,
                },
            },
        },
    };

    const response = await heygenFetch<HeyGenTemplateVideoResponse>('/v2/template/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (response.error) {
        throw new Error(`HeyGen template video creation failed: ${response.error}`);
    }

    return response.data.video_id;
}

/**
 * Create a video generation task with HeyGen (direct avatar, no template)
 * Use this if you don't need intro/outro
 */
export async function createHeyGenVideo(script: string): Promise<string> {
    // If template ID is configured, use template-based generation (includes intro/outro)
    if (process.env.HEYGEN_TEMPLATE_ID) {
        console.log('Using HeyGen template for video generation (includes intro/outro)');
        return createHeyGenVideoFromTemplate(script);
    }

    // Otherwise, use direct avatar generation (no intro/outro)
    console.log('Using direct HeyGen avatar generation (no intro/outro)');

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

    // Log the full response for debugging
    console.log('HeyGen API response:', JSON.stringify(response, null, 2));

    if (response.code !== 100) {
        // Properly stringify the error details
        let errorDetails: string;
        if (response.message) {
            errorDetails = response.message;
        } else if (response.data) {
            errorDetails = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        } else {
            errorDetails = JSON.stringify(response);
        }
        throw new Error(`HeyGen video creation failed: ${errorDetails}`);
    }

    if (!response.data?.video_id) {
        throw new Error(`HeyGen video creation failed: No video_id in response - ${JSON.stringify(response)}`);
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

/**
 * TikTok Pixel Tracking Utility
 * 
 * This utility provides type-safe functions for tracking events with TikTok Pixel.
 * Events are only fired in production or when the pixel is loaded.
 */

// TikTok Pixel interface - ttq is an array-like object with methods attached
interface TikTokPixel {
    track: (event: string, data?: Record<string, unknown>) => void;
    identify: (data: Record<string, unknown>) => void;
    page: () => void;
    push: (args: unknown[]) => void;
}

// Extend Window interface for TikTok Pixel
declare global {
    interface Window {
        ttq?: TikTokPixel;
    }
}

// SHA-256 hash function for PII data
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if we're in a browser environment
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

// Get TikTok Pixel instance safely
function getTTQ(): TikTokPixel | null {
    if (!isBrowser()) return null;

    const ttq = window.ttq;
    if (!ttq) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('[TikTok Pixel] ttq not found on window');
        }
        return null;
    }

    return ttq;
}

// Safe track function that handles both queued and loaded states
function safeTrack(event: string, data?: Record<string, unknown>): void {
    const ttq = getTTQ();
    if (!ttq) return;

    try {
        ttq.track(event, data);
        if (process.env.NODE_ENV === 'development') {
            console.log(`[TikTok Pixel] Tracked: ${event}`, data);
        }
    } catch (error) {
        console.error(`[TikTok Pixel] Error tracking ${event}:`, error);
    }
}

// Safe identify function
function safeIdentify(data: Record<string, string>): void {
    const ttq = getTTQ();
    if (!ttq) return;

    try {
        ttq.identify(data);
        if (process.env.NODE_ENV === 'development') {
            console.log('[TikTok Pixel] Identified user:', data);
        }
    } catch (error) {
        console.error('[TikTok Pixel] Error identifying:', error);
    }
}

// Product info for video service
const PRODUCT = {
    content_id: 'santa-video-personalized',
    content_type: 'product',
    content_name: 'Video Personalizat Moș Crăciun',
};

/**
 * Identify user with hashed PII data
 */
export async function ttqIdentify(data: {
    email?: string;
    phone?: string;
    externalId?: string;
}): Promise<void> {
    if (!isBrowser()) return;

    try {
        const identifyData: Record<string, string> = {};

        if (data.email) {
            identifyData.email = await sha256(data.email);
        }
        if (data.phone) {
            // Normalize phone to E.164 format before hashing
            const normalizedPhone = data.phone.replace(/\D/g, '');
            identifyData.phone_number = await sha256(normalizedPhone);
        }
        if (data.externalId) {
            identifyData.external_id = await sha256(data.externalId);
        }

        if (Object.keys(identifyData).length > 0) {
            safeIdentify(identifyData);
        }
    } catch (error) {
        console.error('[TikTok Pixel] Identify error:', error);
    }
}

/**
 * Track ViewContent - When user views product page
 */
export function ttqViewContent(value: number, currency = 'RON'): void {
    safeTrack('ViewContent', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track AddToCart - When user adds product (creates order)
 */
export function ttqAddToCart(value: number, currency = 'RON'): void {
    safeTrack('AddToCart', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track InitiateCheckout - When user starts checkout process
 */
export function ttqInitiateCheckout(value: number, currency = 'RON'): void {
    safeTrack('InitiateCheckout', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track AddPaymentInfo - When user is on payment page
 */
export function ttqAddPaymentInfo(value: number, currency = 'RON'): void {
    safeTrack('AddPaymentInfo', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track PlaceAnOrder - When user clicks pay button
 */
export function ttqPlaceAnOrder(value: number, currency = 'RON'): void {
    safeTrack('PlaceAnOrder', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track CompletePayment/Purchase - When payment is successful
 */
export function ttqPurchase(value: number, currency = 'RON', orderId?: string): void {
    safeTrack('CompletePayment', {
        contents: [{
            ...PRODUCT,
            content_id: orderId || PRODUCT.content_id,
        }],
        value,
        currency,
    });
}

/**
 * Track CompleteRegistration - When user completes form
 */
export function ttqCompleteRegistration(value: number, currency = 'RON'): void {
    safeTrack('CompleteRegistration', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

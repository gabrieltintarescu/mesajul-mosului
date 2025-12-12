/**
 * TikTok Pixel Tracking Utility
 * 
 * This utility provides type-safe functions for tracking events with TikTok Pixel.
 * Events are only fired in production or when the pixel is loaded.
 */

// Extend Window interface for TikTok Pixel
declare global {
    interface Window {
        ttq?: {
            track: (event: string, data?: Record<string, unknown>) => void;
            identify: (data: Record<string, unknown>) => void;
            page: () => void;
        };
    }
}

// SHA-256 hash function for PII data
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if TikTok Pixel is available
function isTTQAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.ttq;
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
    if (!isTTQAvailable()) return;

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
            window.ttq?.identify(identifyData);
        }
    } catch (error) {
        console.error('TikTok identify error:', error);
    }
}

/**
 * Track ViewContent - When user views product page
 */
export function ttqViewContent(value: number, currency = 'RON'): void {
    if (!isTTQAvailable()) return;

    window.ttq?.track('ViewContent', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track AddToCart - When user adds product (creates order)
 */
export function ttqAddToCart(value: number, currency = 'RON'): void {
    if (!isTTQAvailable()) return;

    window.ttq?.track('AddToCart', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track InitiateCheckout - When user starts checkout process
 */
export function ttqInitiateCheckout(value: number, currency = 'RON'): void {
    if (!isTTQAvailable()) return;

    window.ttq?.track('InitiateCheckout', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track AddPaymentInfo - When user is on payment page
 */
export function ttqAddPaymentInfo(value: number, currency = 'RON'): void {
    if (!isTTQAvailable()) return;

    window.ttq?.track('AddPaymentInfo', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track PlaceAnOrder - When user clicks pay button
 */
export function ttqPlaceAnOrder(value: number, currency = 'RON'): void {
    if (!isTTQAvailable()) return;

    window.ttq?.track('PlaceAnOrder', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

/**
 * Track CompletePayment/Purchase - When payment is successful
 */
export function ttqPurchase(value: number, currency = 'RON', orderId?: string): void {
    if (!isTTQAvailable()) return;

    window.ttq?.track('CompletePayment', {
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
    if (!isTTQAvailable()) return;

    window.ttq?.track('CompleteRegistration', {
        contents: [PRODUCT],
        value,
        currency,
    });
}

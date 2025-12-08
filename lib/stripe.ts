import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-11-17.clover',
            typescript: true,
        });
    }
    return _stripe;
}

// Export a proxy object that lazily initializes stripe
export const stripe = {
    get instance(): Stripe {
        return getStripe();
    },
    checkout: {
        sessions: {
            create: (params: Stripe.Checkout.SessionCreateParams) =>
                getStripe().checkout.sessions.create(params),
            retrieve: (id: string) =>
                getStripe().checkout.sessions.retrieve(id),
        }
    },
    webhooks: {
        constructEvent: (body: string, sig: string, secret: string) =>
            getStripe().webhooks.constructEvent(body, sig, secret),
    }
};

export function getBasePrice(): number {
    return parseInt(process.env.VIDEO_PRICE_CENTS || '8900', 10);
}

export function calculateFinalPrice(
    basePrice: number,
    discountPercent: number = 0,
    discountFixed: number = 0
): number {
    let finalPrice = basePrice;

    // Apply percentage discount first
    if (discountPercent > 0) {
        finalPrice = Math.round(finalPrice * (1 - discountPercent / 100));
    }

    // Then apply fixed discount
    if (discountFixed > 0) {
        finalPrice = Math.max(0, finalPrice - discountFixed);
    }

    return finalPrice;
}

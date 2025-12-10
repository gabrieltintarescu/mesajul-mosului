import {
    AdminOrdersResponse,
    AdminUpdateStatusPayload,
    ApiResponse,
    InitiateOrderPayload,
    Order,
    OrderStatus,
} from '@/types';

export interface PricingInfo {
    basePriceCents: number;
    holidayDiscountCents: number;
    finalPriceCents: number;
    basePriceLei: number;
    holidayDiscountLei: number;
    finalPriceLei: number;
    currency: string;
}

/**
 * Get current pricing information
 */
export async function getPricing(): Promise<ApiResponse<PricingInfo>> {
    try {
        const response = await fetch('/api/pricing');
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Failed to get pricing',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error getting pricing:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Initiate a new order with child details
 * Creates an order in Supabase and returns the orderId
 */
export async function initiateOrder(
    payload: InitiateOrderPayload & { couponCode?: string }
): Promise<ApiResponse<{ orderId: string; finalPrice: number; discountAmount: number }>> {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: payload.email,
                childDetails: payload.childDetails,
                invoicingDetails: payload.invoicingDetails,
                couponCode: payload.couponCode,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Failed to create order',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error initiating order:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Validate a coupon code
 */
export async function validateCoupon(
    code: string
): Promise<ApiResponse<{
    code: string;
    discountPercent: number;
    discountFixed: number;
    discountAmount: number;
    originalPrice: number;
    finalPrice: number;
}>> {
    try {
        const response = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Invalid coupon code',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error validating coupon:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Apply a coupon code to an existing order
 */
export async function applyCouponToOrder(
    orderId: string,
    couponCode: string
): Promise<ApiResponse<{
    code: string;
    discountAmount: number;
    finalPrice: number;
}>> {
    try {
        const response = await fetch(`/api/orders/${orderId}/apply-coupon`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ couponCode }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Invalid coupon code',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error applying coupon:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Remove a coupon from an existing order
 */
export async function removeCouponFromOrder(
    orderId: string
): Promise<ApiResponse<{ finalPrice: number }>> {
    try {
        const response = await fetch(`/api/orders/${orderId}/apply-coupon`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Failed to remove coupon',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error removing coupon:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Get order status by ID
 * Requires email for verification
 */
export async function getOrderStatus(
    orderId: string,
    email: string
): Promise<ApiResponse<{ order: Order }>> {
    try {
        const response = await fetch(`/api/orders/${orderId}?email=${encodeURIComponent(email)}`);

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Order not found',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error getting order status:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Create Stripe checkout session
 * Returns the Stripe Checkout URL to redirect the user to
 */
export async function createCheckoutSession(
    orderId: string
): Promise<ApiResponse<{ sessionId: string; url: string }> & { alreadyPaid?: boolean }> {
    try {
        const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Failed to create checkout session',
                alreadyPaid: result.alreadyPaid || false,
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Helper to get admin token from localStorage
 */
function getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const storage = localStorage.getItem('santa-admin-storage');
        if (storage) {
            const parsed = JSON.parse(storage);
            return parsed.state?.token || null;
        }
    } catch {
        return null;
    }
    return null;
}

/**
 * Admin: Get all orders with pagination
 */
export async function adminGetOrders(
    page: number = 1,
    pageSize: number = 20,
    statusFilter?: OrderStatus,
    search?: string,
    startDate?: string,
    endDate?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
): Promise<ApiResponse<AdminOrdersResponse>> {
    try {
        const token = getAdminToken();
        if (!token) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
        });
        if (statusFilter) {
            params.append('status', statusFilter);
        }
        if (search) {
            params.append('search', search);
        }
        if (startDate) {
            params.append('startDate', startDate);
        }
        if (endDate) {
            params.append('endDate', endDate);
        }
        if (sortBy) {
            params.append('sortBy', sortBy);
        }
        if (sortOrder) {
            params.append('sortOrder', sortOrder);
        }

        const response = await fetch(`/api/admin/orders?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Failed to fetch orders',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Admin: Update order status
 */
export async function adminUpdateOrderStatus(
    payload: AdminUpdateStatusPayload
): Promise<ApiResponse<{ order: Order }>> {
    try {
        const token = getAdminToken();
        if (!token) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        const response = await fetch(`/api/admin/orders/${payload.orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status: payload.status }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Failed to update order',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}

/**
 * Verify admin password
 */
export async function adminLogin(
    password: string
): Promise<ApiResponse<{ token: string }>> {
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Invalid password',
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error('Error logging in:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}
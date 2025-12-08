import {
    AdminOrdersResponse,
    AdminUpdateStatusPayload,
    ApiResponse,
    CompletePaymentResponse,
    InitiateOrderPayload,
    InitiateOrderResponse,
    Order,
    OrderStatus,
    OrderStatusResponse,
} from '@/types';

// Simulated delay for realistic API behavior
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockOrders: Order[] = [
    {
        id: 'order_001',
        childDetails: {
            name: 'Emma',
            age: 7,
            gender: 'girl',
            achievements: 'Got straight A\'s in school, learned to swim',
            favoriteThings: 'Unicorns, drawing, chocolate',
            behavior: 'nice',
        },
        status: 'completed',
        videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-01T10:30:00Z',
        email: 'parent1@example.com',
    },
    {
        id: 'order_002',
        childDetails: {
            name: 'Lucas',
            age: 5,
            gender: 'boy',
            achievements: 'Learned to ride a bike, helped grandma',
            favoriteThings: 'Dinosaurs, cars, pizza',
            behavior: 'mostly_nice',
        },
        status: 'generating_video',
        createdAt: '2024-12-05T14:00:00Z',
        updatedAt: '2024-12-05T14:15:00Z',
        email: 'parent2@example.com',
    },
    {
        id: 'order_003',
        childDetails: {
            name: 'Sophie',
            age: 9,
            gender: 'girl',
            achievements: 'Won a spelling bee, volunteers at animal shelter',
            favoriteThings: 'Books, cats, ice cream',
            behavior: 'nice',
        },
        status: 'pending_payment',
        createdAt: '2024-12-06T09:00:00Z',
        updatedAt: '2024-12-06T09:00:00Z',
        email: 'parent3@example.com',
    },
];

// In-memory storage for demo
let orders = [...mockOrders];
let orderIdCounter = 4;

// API Base URL (for future real implementation)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Initiate a new order with child details
 */
export async function initiateOrder(
    payload: InitiateOrderPayload
): Promise<ApiResponse<InitiateOrderResponse>> {
    await delay(800);

    const newOrder: Order = {
        id: `order_${String(orderIdCounter++).padStart(3, '0')}`,
        childDetails: payload.childDetails as Order['childDetails'],
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        email: payload.email,
    };

    orders.push(newOrder);

    return {
        success: true,
        data: {
            orderId: newOrder.id,
            checkoutUrl: `/wizard/step2?orderId=${newOrder.id}`,
        },
    };
}

/**
 * Generate script for an order (triggered after payment)
 */
export async function generateScript(
    orderId: string
): Promise<ApiResponse<{ message: string }>> {
    await delay(500);

    const order = orders.find((o) => o.id === orderId);
    if (!order) {
        return { success: false, error: 'Order not found' };
    }

    order.status = 'generating_script';
    order.updatedAt = new Date().toISOString();

    return {
        success: true,
        data: { message: 'Script generation started' },
    };
}

/**
 * Get order status by ID
 */
export async function getOrderStatus(
    orderId: string
): Promise<ApiResponse<OrderStatusResponse>> {
    await delay(300);

    const order = orders.find((o) => o.id === orderId);
    if (!order) {
        return { success: false, error: 'Order not found' };
    }

    // Simulate status progression for demo
    const statusProgression: OrderStatus[] = [
        'paid',
        'generating_script',
        'generating_voice',
        'generating_video',
        'merging',
        'completed',
    ];

    const currentIndex = statusProgression.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < statusProgression.length - 1) {
        // 30% chance to progress status on each poll
        if (Math.random() > 0.7) {
            order.status = statusProgression[currentIndex + 1];
            order.updatedAt = new Date().toISOString();

            if (order.status === 'completed') {
                order.videoUrl = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
            }
        }
    }

    return {
        success: true,
        data: { order },
    };
}

/**
 * Complete payment session (called after Stripe checkout)
 */
export async function completePaymentSession(
    orderId: string,
    paymentIntentId: string
): Promise<ApiResponse<CompletePaymentResponse>> {
    await delay(600);

    const order = orders.find((o) => o.id === orderId);
    if (!order) {
        return { success: false, error: 'Order not found' };
    }

    order.status = 'paid';
    order.paymentIntentId = paymentIntentId;
    order.updatedAt = new Date().toISOString();

    // Automatically start script generation
    setTimeout(() => {
        order.status = 'generating_script';
        order.updatedAt = new Date().toISOString();
    }, 2000);

    return {
        success: true,
        data: { success: true, order },
    };
}

/**
 * Admin: Get all orders with pagination
 */
export async function adminGetOrders(
    page: number = 1,
    pageSize: number = 10,
    statusFilter?: OrderStatus
): Promise<ApiResponse<AdminOrdersResponse>> {
    await delay(400);

    let filteredOrders = orders;
    if (statusFilter) {
        filteredOrders = orders.filter((o) => o.status === statusFilter);
    }

    const total = filteredOrders.length;
    const start = (page - 1) * pageSize;
    const paginatedOrders = filteredOrders.slice(start, start + pageSize);

    return {
        success: true,
        data: {
            orders: paginatedOrders,
            total,
            page,
            pageSize,
        },
    };
}

/**
 * Admin: Update order status
 */
export async function adminUpdateOrderStatus(
    payload: AdminUpdateStatusPayload
): Promise<ApiResponse<{ order: Order }>> {
    await delay(500);

    const order = orders.find((o) => o.id === payload.orderId);
    if (!order) {
        return { success: false, error: 'Order not found' };
    }

    order.status = payload.status;
    order.updatedAt = new Date().toISOString();

    if (payload.status === 'completed' && !order.videoUrl) {
        order.videoUrl = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
    }

    return {
        success: true,
        data: { order },
    };
}

/**
 * Create Stripe checkout session (mocked)
 */
export async function createCheckoutSession(
    orderId: string
): Promise<ApiResponse<{ sessionId: string; url: string }>> {
    await delay(600);

    return {
        success: true,
        data: {
            sessionId: `cs_test_${Date.now()}`,
            url: `/order/${orderId}?payment=success`,
        },
    };
}

/**
 * Verify admin password (mocked)
 */
export async function adminLogin(
    password: string
): Promise<ApiResponse<{ token: string }>> {
    await delay(400);

    // Mock password: "santa2024"
    if (password === 'santa2024') {
        return {
            success: true,
            data: { token: 'mock_admin_token_12345' },
        };
    }

    return {
        success: false,
        error: 'Invalid password',
    };
}

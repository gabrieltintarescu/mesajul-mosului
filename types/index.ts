// Order Status Types
export type OrderStatus =
    | 'pending_payment'
    | 'paid'
    | 'generating_script'
    | 'generating_voice'
    | 'generating_video'
    | 'merging'
    | 'completed'
    | 'failed';

// Child Details for Wizard Step 1
export interface ChildDetails {
    name: string;
    age: number;
    gender: 'boy' | 'girl';
    achievements: string;
    favoriteThings: string;
    behavior: 'nice' | 'naughty' | 'mostly_nice';
}

// Order Types
export interface Order {
    id: string;
    childDetails: ChildDetails;
    status: OrderStatus;
    videoUrl?: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    paymentIntentId?: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface InitiateOrderPayload {
    childDetails: ChildDetails;
    email: string;
}

export interface InitiateOrderResponse {
    orderId: string;
    checkoutUrl: string;
}

export interface GenerateScriptPayload {
    orderId: string;
}

export interface OrderStatusResponse {
    order: Order;
}

export interface CompletePaymentResponse {
    success: boolean;
    order: Order;
}

export interface AdminOrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
}

export interface AdminUpdateStatusPayload {
    orderId: string;
    status: OrderStatus;
}

// Wizard Store Types
export interface WizardState {
    step: number;
    childDetails: Partial<ChildDetails>;
    email: string;
    orderId: string | null;
}

// Testimonial Type
export interface Testimonial {
    id: string;
    name: string;
    location: string;
    content: string;
    rating: number;
    avatar?: string;
}

// Feature Type
export interface Feature {
    icon: string;
    title: string;
    description: string;
}

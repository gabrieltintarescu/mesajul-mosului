// Order Status Types
export type OrderStatus =
    | 'pending_payment'
    | 'paid'
    | 'generating_script'
    | 'generating_voice'
    | 'generating_video'
    | 'merging'
    | 'completed'
    | 'failed'
    | 'expired';

// Child Details for Wizard Step 1
export interface ChildDetails {
    name: string;
    age: number;
    gender: 'boy' | 'girl';
    achievements: string;
    favoriteThings: string;
    behavior: 'nice' | 'naughty' | 'mostly_nice';
}

// Invoicing Details for Wizard Step 2
export interface InvoicingDetails {
    invoiceType: 'individual' | 'business';
    name: string;
    // Individual fields
    cnp?: string;
    // Business fields
    companyName?: string;
    cui?: string;
    regCom?: string;
    // Common fields
    address: string;
    city: string;
    county: string;
    postalCode: string;
    phone: string;
}

// Order Types
export interface Order {
    id: string;
    childDetails: ChildDetails;
    invoicingDetails?: InvoicingDetails;
    status: OrderStatus;
    videoUrl?: string;
    invoiceUrl?: string;
    script?: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    paymentIntentId?: string;
    checkoutSessionId?: string;
    // Pricing fields
    finalPrice: number;
    discountAmount?: number;
    couponCode?: string | null;
    errorMessage?: string | null;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface InitiateOrderPayload {
    childDetails: ChildDetails;
    invoicingDetails?: InvoicingDetails;
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
    stats: {
        total: number;
        completed: number;
        pending: number;
        failed: number;
        revenue: number;
    };
}

export interface AdminUpdateStatusPayload {
    orderId: string;
    status: OrderStatus;
}

// Wizard Store Types
export interface WizardState {
    step: number;
    childDetails: Partial<ChildDetails>;
    invoicingDetails: Partial<InvoicingDetails>;
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

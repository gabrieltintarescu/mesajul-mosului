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

export type InvoiceType = 'individual' | 'business';
export type ChildGender = 'boy' | 'girl';
export type ChildBehavior = 'nice' | 'naughty' | 'mostly_nice';

export interface ChildDetails {
    name: string;
    age: number;
    gender: ChildGender;
    achievements: string;
    favoriteThings: string;
    behavior: ChildBehavior;
}

export interface InvoicingDetails {
    invoiceType: InvoiceType;
    name: string;
    cnp?: string;
    companyName?: string;
    cui?: string;
    regCom?: string;
    address: string;
    city: string;
    county: string;
    postalCode: string;
    phone: string;
}

// Simplified types without full Database generic (works better with Supabase client)
export interface OrderRow {
    id: string;
    email: string;
    child_details: ChildDetails;
    invoicing_details: InvoicingDetails | null;
    status: OrderStatus;
    video_url: string | null;
    script: string | null;
    heygen_video_id: string | null;
    stripe_payment_intent_id: string | null;
    stripe_checkout_session_id: string | null;
    coupon_code: string | null;
    discount_amount: number;
    final_price: number;
    error_message: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderInsert {
    id?: string;
    email: string;
    child_details: ChildDetails;
    invoicing_details?: InvoicingDetails | null;
    status?: OrderStatus;
    video_url?: string | null;
    script?: string | null;
    heygen_video_id?: string | null;
    stripe_payment_intent_id?: string | null;
    stripe_checkout_session_id?: string | null;
    coupon_code?: string | null;
    discount_amount?: number;
    final_price?: number;
    error_message?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface OrderUpdate {
    id?: string;
    email?: string;
    child_details?: ChildDetails;
    invoicing_details?: InvoicingDetails | null;
    status?: OrderStatus;
    video_url?: string | null;
    script?: string | null;
    heygen_video_id?: string | null;
    stripe_payment_intent_id?: string | null;
    stripe_checkout_session_id?: string | null;
    coupon_code?: string | null;
    discount_amount?: number;
    final_price?: number;
    error_message?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CouponRow {
    id: string;
    code: string;
    discount_percent: number;
    discount_fixed: number;
    max_uses: number | null;
    current_uses: number;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

export interface VideoAssetRow {
    id: string;
    type: 'intro' | 'outro';
    video_url: string;
    duration_seconds: number;
    created_at: string;
}

// Alias types for backwards compatibility
export type Order = OrderRow;
export type Coupon = CouponRow;
export type VideoAsset = VideoAssetRow;

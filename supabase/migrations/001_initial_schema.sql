-- Santa Video Orders Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    child_details JSONB NOT NULL,
    invoicing_details JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_payment',
    video_url TEXT,
    script TEXT,
    heygen_video_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    stripe_checkout_session_id VARCHAR(255),
    coupon_code VARCHAR(50),
    discount_amount INTEGER DEFAULT 0,
    final_price INTEGER NOT NULL,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    discount_fixed INTEGER DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video assets table (for intro/outro)
CREATE TABLE IF NOT EXISTS video_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('intro', 'outro')),
    video_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Function to increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE coupons 
    SET current_uses = current_uses + 1 
    WHERE code = coupon_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_assets ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for backend API)
CREATE POLICY "Service role has full access to orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to coupons" ON coupons
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to video_assets" ON video_assets
    FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous users to read their own orders by ID (for order status page)
CREATE POLICY "Anyone can read order by ID" ON orders
    FOR SELECT USING (true);

-- Allow anonymous users to read active coupons for validation
CREATE POLICY "Anyone can read active coupons" ON coupons
    FOR SELECT USING (is_active = true);

-- Allow anyone to read video assets
CREATE POLICY "Anyone can read video assets" ON video_assets
    FOR SELECT USING (true);

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for videos bucket
CREATE POLICY "Anyone can view videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Service role can upload videos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'service_role');

CREATE POLICY "Service role can update videos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'videos' AND auth.role() = 'service_role');

-- Insert sample coupons for testing
INSERT INTO coupons (code, discount_percent, discount_fixed, max_uses, expires_at, is_active)
VALUES 
    ('CHRISTMAS20', 20, 0, 100, '2024-12-31 23:59:59+00', true),
    ('SANTAFREE', 0, 500, 10, '2024-12-25 23:59:59+00', true),
    ('EARLYBIRD', 15, 0, 50, '2024-12-15 23:59:59+00', true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample video assets (update these URLs with your actual intro/outro videos)
INSERT INTO video_assets (type, video_url, duration_seconds)
VALUES 
    ('intro', 'https://your-supabase-url.supabase.co/storage/v1/object/public/videos/assets/intro.mp4', 5),
    ('outro', 'https://your-supabase-url.supabase.co/storage/v1/object/public/videos/assets/outro.mp4', 5)
ON CONFLICT DO NOTHING;

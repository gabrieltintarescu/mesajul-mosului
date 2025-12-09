-- Add invoice_url column to orders table
-- This stores the Supabase Storage URL for the generated invoice PDF

ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN orders.invoice_url IS 'URL to the invoice PDF stored in Supabase Storage';

# Santa Video Backend API

This document describes the backend API implementation for the personalized AI-generated Santa video application.

## 🏗️ Architecture Overview

```
User submits form → Order created → Stripe Payment → Webhook triggers →
Inngest Background Job starts → ChatGPT generates script → HeyGen creates video →
Shotstack concatenates intro/main/outro → Upload to Supabase → Email sent to user
```

### Key Features
- **Fully async processing** - User doesn't wait for video generation
- **Background jobs with Inngest** - Reliable, retryable job processing
- **Cloud video processing** - Shotstack API for intro/outro concatenation (no FFmpeg needed)
- **Email notifications** - User notified when video is ready

## 📁 Backend Structure

```
app/api/
├── orders/
│   ├── route.ts              # POST - Create new order
│   └── [id]/route.ts         # GET - Get order by ID
├── coupons/
│   └── validate/route.ts     # POST - Validate coupon code
├── stripe/
│   ├── checkout/route.ts     # POST - Create checkout session
│   └── webhook/route.ts      # POST - Handle Stripe webhooks
├── inngest/
│   └── route.ts              # Inngest webhook handler
├── video/
│   └── generate/route.ts     # POST - Manual video generation trigger
└── admin/
    ├── login/route.ts        # POST - Admin login
    └── orders/
        ├── route.ts          # GET - List all orders
        └── [id]/route.ts     # GET/PATCH - Get/update order

lib/
├── stripe.ts                 # Stripe client configuration
├── supabase/
│   ├── client.ts            # Client-side Supabase
│   ├── server.ts            # Server-side Supabase (admin)
│   ├── database.types.ts    # TypeScript types for DB
│   └── index.ts             # Exports
├── inngest/
│   ├── client.ts            # Inngest client
│   ├── functions.ts         # Background job definitions
│   └── index.ts             # Exports
└── services/
    ├── openai.ts            # ChatGPT script generation (Romanian)
    ├── heygen.ts            # HeyGen video API (Romanian voice)
    ├── email.ts             # Resend email service
    ├── video.ts             # Video processing (Shotstack)
    └── index.ts             # Exports

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema
```

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI
OPENAI_API_KEY=sk-...

# HeyGen
HEYGEN_API_KEY=your_heygen_api_key
HEYGEN_AVATAR_ID=your_avatar_id
HEYGEN_VOICE_ID=your_voice_id  # Use a Romanian voice ID

# Resend (Email)
RESEND_API_KEY=re_...
EMAIL_FROM=Santa Claus <santa@yourdomain.com>

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Shotstack (Video Processing - optional, for intro/outro concatenation)
SHOTSTACK_API_KEY=your_shotstack_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
VIDEO_PRICE_CENTS=2999

# Admin
ADMIN_PASSWORD=santa2024
```

## 📊 Database Schema

Run the migration in Supabase SQL Editor:

### Tables

**orders**
- `id` - UUID primary key
- `email` - Customer email
- `child_details` - JSON with child info (name, age, gender, achievements, etc.)
- `invoicing_details` - Optional JSON with billing info
- `status` - Order status (pending_payment, paid, generating_script, etc.)
- `video_url` - Final video URL
- `script` - Generated Santa script
- `heygen_video_id` - HeyGen video task ID
- `stripe_payment_intent_id` - Stripe payment reference
- `coupon_code` - Applied coupon
- `discount_amount` - Discount in cents
- `final_price` - Final price in cents
- `error_message` - Error details if failed

**coupons**
- `id` - UUID primary key
- `code` - Unique coupon code
- `discount_percent` - Percentage discount (0-100)
- `discount_fixed` - Fixed discount in cents
- `max_uses` - Maximum number of uses
- `current_uses` - Current usage count
- `expires_at` - Expiration date
- `is_active` - Whether coupon is active

**video_assets**
- `id` - UUID primary key
- `type` - 'intro' or 'outro'
- `video_url` - URL to pre-made video asset
- `duration_seconds` - Video duration

## 🔌 API Endpoints

### Orders

#### POST /api/orders
Create a new order.

**Request:**
```json
{
  "email": "parent@example.com",
  "childDetails": {
    "name": "Emma",
    "age": 7,
    "gender": "girl",
    "achievements": "Learned to swim",
    "favoriteThings": "Unicorns",
    "behavior": "nice"
  },
  "invoicingDetails": { ... },
  "couponCode": "CHRISTMAS20"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "finalPrice": 2399,
    "discountAmount": 600
  }
}
```

#### GET /api/orders/[id]
Get order status and details.

### Coupons

#### POST /api/coupons/validate
Validate a coupon code.

**Request:**
```json
{
  "code": "CHRISTMAS20"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "CHRISTMAS20",
    "discountPercent": 20,
    "discountFixed": 0,
    "discountAmount": 600,
    "originalPrice": 2999,
    "finalPrice": 2399
  }
}
```

### Stripe

#### POST /api/stripe/checkout
Create a Stripe checkout session.

**Request:**
```json
{
  "orderId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

#### POST /api/stripe/webhook
Handles Stripe webhook events (checkout.session.completed, etc.)

### Video Generation

#### POST /api/video/generate
Triggers the video generation pipeline. Called automatically by webhook.

**Request:**
```json
{
  "orderId": "uuid"
}
```

### Admin

#### POST /api/admin/login
Admin authentication.

#### GET /api/admin/orders
List all orders with pagination.

#### GET /api/admin/orders/[id]
Get detailed order info.

#### PATCH /api/admin/orders/[id]
Update order status.

## 🎬 Video Generation Pipeline (Background Job)

The entire video generation runs as an Inngest background job, so users don't wait:

1. **Stripe Webhook** triggers `video/generate.requested` Inngest event
2. **Script Generation** (OpenAI GPT-4o)
   - Takes child details as input
   - Generates personalized Santa script in **Romanian** (120-150 words)

3. **Video Generation** (HeyGen API)
   - Uses configured Santa avatar
   - Text-to-speech with **Romanian voice**
   - Polls for completion (up to 10 minutes)

4. **Video Processing** (Shotstack - optional)
   - Downloads HeyGen video
   - If Shotstack configured: concatenates intro + main + outro
   - Uploads final video to Supabase Storage

5. **Email Notification** (Resend)
   - Sends beautiful HTML email in Romanian
   - Includes link to order page

## 🔗 Intro/Outro Videos

The system supports intro/outro cut-scenes stored in Supabase:

**With Shotstack (recommended):**
- Configure `SHOTSTACK_API_KEY` 
- Videos are concatenated server-side
- User receives a single final video

**Without Shotstack:**
- Main HeyGen video is stored
- You can implement client-side sequential playback

To set up intro/outro:
1. Upload videos to Supabase Storage `videos/assets/` bucket
2. Insert records into `video_assets` table

## 🔄 Inngest Background Jobs

The app uses [Inngest](https://www.inngest.com/) for reliable background job processing:

```bash
# Local development
npx inngest-cli@latest dev

# This opens a dashboard at http://localhost:8288
# Configure your Next.js app to use it
```

**Benefits:**
- Automatic retries on failure
- Step-by-step execution with checkpoints
- Built-in monitoring dashboard
- Works with Vercel, Railway, etc.

## 🧪 Testing

### Local Development
```bash
# Start the dev server
npm run dev

# In another terminal, start Inngest dev server
npx inngest-cli@latest dev

# In another terminal, forward Stripe webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Sample Coupon Codes (from migration)
- `CHRISTMAS20` - 20% off
- `SANTAFREE` - 5 RON off
- `EARLYBIRD` - 15% off

## 🚀 Deployment

1. Set all environment variables in your hosting platform
2. Run database migration in Supabase
3. Configure Stripe webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Configure Inngest webhook: `https://yourdomain.com/api/inngest`
5. Upload intro/outro videos to Supabase Storage
6. Configure Supabase Storage bucket policies

## 📝 Order Status Flow

```
pending_payment → paid → generating_script → generating_video → merging → completed
                    ↓                            ↓
                  failed                       failed
```

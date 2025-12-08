# 🎅 Mesaj de la Moșu - Personalized Santa Video Messages

A full-stack Next.js application that sells personalized AI-generated Santa video messages for children. Parents fill out a form about their child, and the system generates a unique video message from Santa mentioning specific details about the child.

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│     Vercel      │────▶│    Supabase     │
│   (Frontend +   │     │   (Hosting)     │     │   (Database +   │
│     API)        │     │                 │     │    Storage)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Stripe      │     │     Inngest     │     │     Sentry      │
│   (Payments)    │     │ (Background     │     │   (Monitoring)  │
│                 │     │    Jobs)        │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│     OpenAI      │   │     HeyGen      │   │     Resend      │
│  (Script Gen)   │   │  (Video Gen)    │   │    (Emails)     │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

## 📋 Prerequisites

Before starting, you'll need accounts for:

- [Vercel](https://vercel.com) - Hosting (you already have this)
- [Supabase](https://supabase.com) - Database & file storage
- [Stripe](https://stripe.com) - Payment processing
- [Inngest](https://inngest.com) - Background job processing
- [OpenAI](https://platform.openai.com) - GPT-4 for script generation
- [HeyGen](https://heygen.com) - AI video generation
- [Resend](https://resend.com) - Transactional emails
- [Sentry](https://sentry.io) - Error monitoring (already configured)

**Optional:**
- [Shotstack](https://shotstack.io) - Video concatenation (for intro/outro)

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database migration:**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the SQL to create all tables and functions

3. **Create a storage bucket for videos:**
   - Go to Storage in Supabase dashboard
   - Click "New bucket"
   - Name: `videos`
   - Set to **Public** (so users can view their videos)
   - Add a policy for service role to upload:
     ```sql
     CREATE POLICY "Service role can upload" ON storage.objects
     FOR INSERT TO service_role WITH CHECK (bucket_id = 'videos');
     
     CREATE POLICY "Public can view videos" ON storage.objects
     FOR SELECT TO public USING (bucket_id = 'videos');
     ```

4. **Get your credentials:**
   - Go to Settings → API
   - Copy:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Stripe Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com)

2. **Get API keys:**
   - Go to Developers → API Keys
   - Copy:
     - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - Secret key → `STRIPE_SECRET_KEY`

3. **Set up webhook endpoint:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

4. **For local testing:**
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks to local
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### Step 3: Inngest Setup

Inngest handles the video generation pipeline in the background.

1. **Create account** at [inngest.com](https://inngest.com)

2. **Create an app:**
   - Go to Apps → Create App
   - Name: `mesaj-de-la-mosu`

3. **Get credentials:**
   - Go to Settings → Signing Key → `INNGEST_SIGNING_KEY`
   - Go to Settings → Event Keys → Create one → `INNGEST_EVENT_KEY`

4. **Connect to Vercel:**
   - Go to your app in Inngest dashboard
   - Click "Connect" → "Vercel"
   - Follow the integration steps
   - Or manually set the webhook URL: `https://your-domain.vercel.app/api/inngest`

5. **Verify connection:**
   - After deploying, go to Inngest dashboard
   - You should see `video-generation` function registered

### Step 4: OpenAI Setup

1. **Get API key** from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new key → `OPENAI_API_KEY`

2. **Ensure you have GPT-4 access** (required for quality scripts)

3. **Set spending limits** in Settings → Limits to prevent runaway costs

### Step 5: HeyGen Setup

1. **Create account** at [heygen.com](https://heygen.com)

2. **Get API key:**
   - Go to Settings → API
   - Copy API key → `HEYGEN_API_KEY`

3. **Choose your Santa avatar:**
   - Browse avatars in HeyGen
   - Find a Santa-style avatar
   - Copy the avatar ID → `HEYGEN_AVATAR_ID`

4. **Choose Romanian voice:**
   - Go to Voices in HeyGen
   - Find a Romanian male voice (or create a custom one)
   - Copy the voice ID → `HEYGEN_VOICE_ID`

5. **Test in HeyGen playground first** to ensure quality

### Step 6: Resend Setup

1. **Create account** at [resend.com](https://resend.com)

2. **Verify your domain:**
   - Go to Domains → Add Domain
   - Add DNS records as instructed
   - Wait for verification

3. **Get API key:**
   - Go to API Keys → Create
   - Copy key → `RESEND_API_KEY`

4. **Set sender:**
   - `EMAIL_FROM=Moș Crăciun <mos@your-verified-domain.com>`

### Step 7: Security Keys

Generate secure random keys for internal use:

```bash
# Generate two random 32-character hex strings
openssl rand -hex 16  # Use for INTERNAL_API_KEY
openssl rand -hex 16  # Use for ADMIN_TOKEN_SECRET
```

Also set a strong `ADMIN_PASSWORD` (not the default!).

---

## 🔧 Environment Variables

### Vercel Configuration

Go to your Vercel project → Settings → Environment Variables and add ALL of these:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# OpenAI
OPENAI_API_KEY=sk-...

# HeyGen
HEYGEN_API_KEY=your_heygen_key
HEYGEN_AVATAR_ID=your_santa_avatar_id
HEYGEN_VOICE_ID=your_romanian_voice_id

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM=Moș Crăciun <mos@yourdomain.com>

# Inngest
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=signkey-...

# Shotstack (optional - for intro/outro videos)
SHOTSTACK_API_KEY=your_key

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Pricing (in cents - 2999 = 29.99 RON/EUR)
VIDEO_PRICE_CENTS=2999

# Security
ADMIN_PASSWORD=your_very_secure_password
INTERNAL_API_KEY=<32-char random string>
ADMIN_TOKEN_SECRET=<32-char random string>

# Sentry (already configured)
SENTRY_AUTH_TOKEN=sntrys_...
```

### Local Development

Create a `.env.local` file:

```bash
cp .env.example .env.local
# Then fill in all values
```

---

## 🎬 Video Assets (Optional)

If you want intro/outro videos concatenated with the main Santa message:

1. **Upload to Supabase Storage:**
   - Create folder `assets/` in your `videos` bucket
   - Upload `intro.mp4` and `outro.mp4`

2. **Add to video_assets table:**
   ```sql
   INSERT INTO video_assets (type, storage_path, is_active) VALUES
   ('intro', 'assets/intro.mp4', true),
   ('outro', 'assets/outro.mp4', true);
   ```

3. **Set up Shotstack** (required for video concatenation):
   - Get API key from [shotstack.io](https://shotstack.io)
   - Add `SHOTSTACK_API_KEY` to environment variables

Without Shotstack, the system will skip concatenation and deliver just the HeyGen video.

---

## 📱 User Flow

1. **User visits site** → Fills wizard form (child details)
2. **Step 1** → Child info (name, age, achievements, etc.)
3. **Step 2** → Payment via Stripe checkout
4. **After payment:**
   - Order marked as `paid`
   - Inngest triggers background job
   - OpenAI generates personalized Romanian script
   - HeyGen creates video with Santa avatar
   - Video uploaded to Supabase Storage
   - Email sent with video link
5. **User can check status** at `/order/[id]?email=their@email.com`

---

## 🔍 Monitoring & Debugging

### Sentry Dashboard
- Already configured at: `gtc-grup/mesaj-de-la-mosu-nextjs`
- View errors with full order context
- Track video generation failures

### Inngest Dashboard
- Monitor background job execution
- View failed jobs and retry
- See step-by-step execution logs

### Stripe Dashboard
- View payments and webhooks
- Check failed payments
- Issue refunds if needed

### Admin Panel
- Access at: `/admin`
- Login with `ADMIN_PASSWORD`
- View all orders and statuses

---

## 🧪 Testing the Full Flow

### 1. Local Testing

```bash
# Start dev server
npm run dev

# In another terminal, forward Stripe webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, run Inngest dev server
npx inngest-cli@latest dev
```

### 2. Test Order Flow

1. Go to `http://localhost:3000`
2. Fill out the wizard form
3. Use Stripe test card: `4242 4242 4242 4242`
4. Watch Inngest dashboard for job execution
5. Check Supabase for order updates
6. Verify email delivery in Resend dashboard

### 3. Production Testing

1. Deploy to Vercel
2. Verify Inngest connection in dashboard
3. Test with Stripe test mode first
4. Check Sentry for any errors
5. Switch to Stripe live mode when ready

---

## 🚨 Troubleshooting

### Video generation stuck at "generating_video"
- Check Inngest dashboard for job status
- Verify HeyGen API key and credits
- Check Sentry for errors

### Webhook not working
- Verify webhook secret matches
- Check Vercel function logs
- Ensure webhook URL is correct

### Emails not sending
- Verify Resend domain is verified
- Check spam folder
- View Resend logs

### Payment fails
- Check Stripe dashboard for error
- Verify API keys are correct (test vs live)

---

## 💰 Cost Estimates (per video)

| Service | Cost per Video |
|---------|---------------|
| OpenAI GPT-4 | ~$0.03 |
| HeyGen | ~$1.00 (depends on plan) |
| Resend | ~$0.001 |
| Supabase | ~$0.001 |
| Shotstack | ~$0.05 (if used) |
| **Total** | **~$1.10 per video** |

Set your `VIDEO_PRICE_CENTS` to ensure healthy margins!

---

## 🔐 Security Checklist

- [ ] Strong `ADMIN_PASSWORD` set (not default)
- [ ] `INTERNAL_API_KEY` generated and set
- [ ] `ADMIN_TOKEN_SECRET` generated and set
- [ ] Stripe webhooks using signature verification
- [ ] Supabase RLS policies enabled
- [ ] Rate limiting active on order creation
- [ ] Sentry monitoring errors

---

## 📦 Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Supabase database migrated
- [ ] Supabase storage bucket created
- [ ] Stripe webhook configured with production URL
- [ ] Inngest connected to Vercel
- [ ] Resend domain verified
- [ ] HeyGen avatar and voice configured
- [ ] Sentry receiving events
- [ ] Test order completed successfully
- [ ] Stripe switched to live mode

---

## 🆘 Support

If you encounter issues:

1. Check Sentry for errors
2. Check Inngest dashboard for job failures
3. Review Vercel function logs
4. Check individual service dashboards (Stripe, HeyGen, etc.)

---

Made with ❤️ for bringing Christmas magic to children 🎄

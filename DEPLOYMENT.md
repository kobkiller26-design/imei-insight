# Deployment Guide

This guide explains how to deploy IMEI Insight to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free at https://vercel.com)
- IMEI24 API key (from https://imei.org)

## Automatic Deployment (Recommended)

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `imei-insight` repository
4. Click **"Import"**

### Step 2: Set Environment Variables

In the Vercel dashboard, before clicking **"Deploy"**:

1. Expand **"Environment Variables"**
2. Add the following:

| Name | Value | Required |
|---|---|---|
| `IMEI24_API_KEY` | Your IMEI24 API key | ✅ |
| `IMEI24_API_URL` | `https://api-client.imei.org/api/dhru` | No |
| `SUPABASE_URL` | Your Supabase project URL | No |
| `SUPABASE_KEY` | Your Supabase anon key | No |
| `JWT_SECRET` | A long random string | Recommended |
| `STRIPE_SECRET` | Your Stripe secret key | No |

### Step 3: Deploy

Click **"Deploy"**. Vercel will:

1. Build the project
2. Deploy API routes as serverless functions
3. Serve HTML files statically
4. Give you a live URL like `https://imei-insight.vercel.app`

### Step 4: Test

1. Open your live URL
2. Enter a 15-digit IMEI
3. Click **Check IMEI**
4. Results appear instantly ✅

---

## Manual Deployment (CLI)

### Step 1: Install Vercel CLI

```bash
npm install
```

### Step 2: Login

```bash
npx vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy (preview)

```bash
npm run dev     # test locally first
npm run deploy  # deploy to production
```

### Step 4: Set Environment Variables

```bash
npx vercel env add IMEI24_API_KEY
# Enter your API key when prompted

npx vercel env add JWT_SECRET
# Enter a random secret string
```

Or set them all via the Vercel dashboard at https://vercel.com/dashboard.

---

## Auto-Deploy on Git Push

Once connected to Vercel:

1. Every push to `main` branch → automatic production deploy
2. Every pull request → automatic preview deploy

---

## Supabase Setup (Optional)

To save IMEI check history:

1. Create a free project at https://supabase.com
2. Run this SQL in the **SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS imei_checks (
  id           BIGSERIAL PRIMARY KEY,
  imei         TEXT NOT NULL,
  result       JSONB,
  user_email   TEXT,
  checked_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_imei_checks_imei ON imei_checks(imei);
CREATE INDEX IF NOT EXISTS idx_imei_checks_user ON imei_checks(user_email);
```

3. Copy your **Project URL** and **anon/public key** from:
   Settings → API → Project URL / anon public key

4. Add them as Vercel environment variables:
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_KEY` = anon public key

---

## Troubleshooting

### "IMEI24_API_KEY is not configured"
→ Add `IMEI24_API_KEY` to your Vercel environment variables and redeploy.

### "IMEI must be exactly 15 digits"
→ Make sure the IMEI you entered is exactly 15 numeric digits.

### "IMEI failed Luhn check"
→ Double-check the IMEI number. Dial `*#06#` on your phone to get the correct IMEI.

### API returns HTTP 502
→ The IMEI24 API is unreachable. Check your `IMEI24_API_URL` setting or try again later.

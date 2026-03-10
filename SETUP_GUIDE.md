# IMEI Insight - Setup Guide

Complete guide for setting up, testing, and deploying IMEI Insight locally and to Vercel.

---

## ⚡ Quick Start (One Command)

```bash
npm run setup && npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 📋 Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org)
- **npm** (bundled with Node.js)
- **Vercel CLI** (installed automatically by setup script)
- **IMEI.org API Key** — available from your [IMEI.org account](https://imei.org)
- **Supabase project** (optional, for saving check history)

---

## 🛠️ Step 1: Install Dependencies

```bash
npm install
```

---

## 🔑 Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your credentials:

```bash
# Required: IMEI.org API key
IMEI_API_KEY=your_imei_api_key_here

# Optional: Supabase (for saving check history)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Where to get your API key

1. Go to [https://imei.org](https://imei.org)
2. Create or log into your account
3. Navigate to **API** → **API Keys**
4. Copy your key and paste it as `IMEI_API_KEY`

---

## 🚀 Step 3: Start Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

> **Note:** Vercel CLI must be installed. The setup script installs it automatically,
> or install manually: `npm install -g vercel`

---

## 🧪 Step 4: Run Tests

```bash
npm test
```

Run with coverage report:

```bash
npm run test:coverage
```

### What the tests cover

| Test File | What It Tests |
|-----------|--------------|
| `tests/api/imei-check.test.ts` | IMEI validation, API call format, error handling |
| `tests/db/supabase.test.ts` | Database save operations, error resilience |
| `tests/integration/full-flow.test.ts` | Complete user flow end-to-end |

---

## 🌐 Step 5: Deploy to Vercel

### Option A: Automatic (via GitHub Actions)

1. Push your code to the `main` branch
2. GitHub Actions runs tests automatically
3. If tests pass, deploys to Vercel automatically

**Required GitHub Secrets** (Settings → Secrets → Actions):
- `VERCEL_TOKEN` — your Vercel personal access token
- `VERCEL_ORG_ID` — your Vercel organization ID
- `VERCEL_PROJECT_ID` — your Vercel project ID
- `IMEI_API_KEY` — your IMEI.org API key

### Option B: Manual deploy script

```bash
npm run deploy
```

For production:

```bash
bash scripts/deploy.sh --prod
```

### Option C: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Add environment variables:
   - `IMEI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` (if using Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY` (if using Supabase)
5. Click **Deploy**

---

## 📁 Project Structure

```
imei-insight/
├── api/                      # Vercel serverless functions
│   ├── check.js              # Main IMEI check endpoint (POST /api/check)
│   ├── api-check.js          # Legacy IMEI check endpoint
│   ├── login.js              # User login
│   ├── register.js           # User registration
│   ├── services.js           # Get available services
│   ├── history.js            # Check history
│   ├── credits.js            # User credits
│   ├── deposit.js            # Add credits via Stripe
│   └── ratelimit.js          # Rate limiting utility
├── lib/                      # Shared utilities
│   ├── auth.js               # JWT authentication helpers
│   ├── db.js                 # In-memory database
│   └── keys.js               # API key management
├── tests/                    # Test suite
│   ├── api/
│   │   └── imei-check.test.ts
│   ├── db/
│   │   └── supabase.test.ts
│   └── integration/
│       └── full-flow.test.ts
├── scripts/
│   ├── setup.sh              # One-command local setup
│   ├── test.sh               # Run all tests
│   └── deploy.sh             # Deploy to Vercel
├── .github/
│   └── workflows/
│       └── test-and-deploy.yml  # CI/CD pipeline
├── index.html                # Main page
├── dashboard.html            # User dashboard
├── imei-check.html           # IMEI check page
├── style.css                 # Styles
├── script.js                 # Client-side scripts
├── package.json              # Node.js configuration
├── vercel.json               # Vercel deployment config
├── jest.config.js            # Jest test configuration
├── tsconfig.json             # TypeScript configuration
└── .env.example              # Environment variable template
```

---

## 🔌 API Endpoints

### `POST /api/check`

Main IMEI check endpoint. Validates IMEI, calls IMEI.org API, and optionally saves to Supabase.

**Request:**
```json
{
  "imei": "359072157095826"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "deviceModel": "iPhone 12 Pro",
    "brand": "Apple",
    "imeiStatus": "Valid",
    "blacklistStatus": "Clean",
    "carrier": "Verizon",
    "country": "United States"
  }
}
```

**Error Responses:**
| Status | Error | Cause |
|--------|-------|-------|
| 400 | `IMEI required` | No IMEI in request body |
| 400 | `IMEI must be exactly 15 digits` | Invalid format |
| 405 | `Method not allowed` | Not a POST request |
| 500 | `API key not configured` | Missing `IMEI_API_KEY` env var |
| 502 | `IMEI check service unavailable` | IMEI.org API error |
| 503 | `Network error. Please try again.` | Network connectivity issue |

### `GET /api/api-check?imei=&service=` or `POST /api/api-check`

Legacy endpoint. Supports both GET query parameters and POST body.

---

## 🗄️ Database Setup (Supabase)

To save IMEI check history, create the `imei_checks` table in Supabase:

```sql
CREATE TABLE imei_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  imei TEXT NOT NULL,
  result_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own checks
CREATE POLICY "Users see own checks"
  ON imei_checks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own checks
CREATE POLICY "Users insert own checks"
  ON imei_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## ❓ Troubleshooting

### `localhost refused to connect` / `ERR_CONNECTION_REFUSED`

The development server is not running. Start it with:

```bash
npm run dev
```

If Vercel CLI is not installed:

```bash
npm install -g vercel
npm run dev
```

### `IMEI required` error when submitting

The API endpoint is receiving the request but the IMEI field is missing or empty. Ensure:
- The IMEI input is not empty
- The IMEI is exactly 15 numeric digits
- The form is submitting to `POST /api/check` with JSON body `{"imei": "..."}`

### `API key not configured` error

Add your IMEI.org API key to `.env.local`:

```bash
IMEI_API_KEY=your_actual_key_here
```

Restart the dev server after changing `.env.local`.

### Tests fail with import errors

Ensure you're running tests with:

```bash
npm test
```

(not `jest` directly, as the `--experimental-vm-modules` flag is required)

### Vercel deployment fails

1. Ensure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are set in GitHub Secrets
2. Check that all environment variables are added in your Vercel project settings
3. Check the Vercel dashboard for deployment logs

---

## 📊 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/test-and-deploy.yml`) runs automatically:

1. **On every push/PR to `main`:** Runs the full test suite
2. **On merge to `main`:** Runs tests then deploys to Vercel if tests pass

**Pipeline stages:**
```
Push to main
    ↓
Install dependencies
    ↓
Run tests with coverage
    ↓
Upload coverage report
    ↓
Deploy to Vercel (production)
    ↓
✅ Live at your Vercel URL
```

---

## 🎯 Success Criteria

After completing setup, verify:

- [ ] `npm run dev` starts server at `http://localhost:3000`
- [ ] Homepage loads without errors
- [ ] IMEI validation rejects non-15-digit inputs
- [ ] Valid IMEI returns device information
- [ ] `npm test` — all tests pass
- [ ] Pushing to `main` triggers GitHub Actions
- [ ] GitHub Actions deploys to Vercel automatically

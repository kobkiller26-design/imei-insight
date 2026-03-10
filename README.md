# IMEI Insight

A static web application with serverless API routes for checking IMEI numbers via the IMEI24/IMEI.org API.

## Features

- ✅ IMEI validation (15-digit format + Luhn algorithm)
- ✅ IMEI lookup via IMEI24 API
- ✅ Optional Supabase integration for check history
- ✅ User registration and login
- ✅ Vercel deployment ready

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Vercel CLI](https://vercel.com/cli) (installed automatically by `npm install`)
- An [IMEI24 API key](https://imei.org)

### 1. Clone and install

```bash
git clone https://github.com/kobkiller26-design/imei-insight.git
cd imei-insight
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

| Variable | Description | Required |
|---|---|---|
| `IMEI24_API_KEY` | Your IMEI24 / IMEI.org API key | ✅ Yes |
| `IMEI24_API_URL` | API base URL (default: https://api-client.imei.org/api/dhru) | No |
| `SUPABASE_URL` | Supabase project URL | No |
| `SUPABASE_KEY` | Supabase anon/public key | No |
| `JWT_SECRET` | Secret string for signing JWT tokens | No |
| `STRIPE_SECRET` | Stripe secret key for credit payments | No |

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Deploy to Vercel

```bash
npm run deploy
```

Or push to GitHub – Vercel auto-deploys on every push.

## Project Structure

```
imei-insight/
├── index.html          # Home page (login + quick IMEI check)
├── imei-check.html     # Dedicated IMEI check page
├── dashboard.html      # User dashboard with history
├── script.js           # Shared frontend utilities
├── style.css           # Global styles
├── api/
│   ├── check.js        # Main IMEI check endpoint (GET/POST)
│   ├── api-check.js    # Legacy IMEI check endpoint
│   ├── save-check.js   # Save result to Supabase
│   ├── services.js     # List available IMEI services
│   ├── register.js     # User registration
│   ├── login.js        # User login
│   ├── credits.js      # User credit balance
│   ├── history.js      # Check history
│   ├── deposit.js      # Stripe deposit (optional)
│   ├── ratelimit.js    # Rate-limiting helper
│   └── reseller-check.js # Reseller API check
├── lib/
│   ├── imei.js         # IMEI validation utilities
│   ├── supabase.js     # Supabase client
│   ├── auth.js         # JWT auth helpers
│   ├── db.js           # In-memory database helpers
│   └── keys.js         # API key management
├── supabase/
│   └── config.json     # Supabase project config
├── tests/
│   └── api.test.js     # Unit tests (IMEI validation)
├── .env.example        # Environment variable template
├── vercel.json         # Vercel deployment configuration
└── package.json        # Project metadata and scripts
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/check?imei=<IMEI>` | Check an IMEI number |
| GET | `/api/services` | List available services |
| POST | `/api/register` | Register a user account |
| POST | `/api/login` | Login to an account |
| GET | `/api/credits` | Get user credit balance |
| GET | `/api/history` | Get check history |
| POST | `/api/save-check` | Save a check result |

## Database Schema (Supabase)

Run this SQL in your Supabase project to create the required table:

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

## Running Tests

```bash
npm test
```

## License

MIT

# IMEI Insight

A production-ready SaaS platform for instant IMEI checks with detailed device information, powered by the IMEI24 API.

## Features

- **IMEI Validation** – 15-digit validation with Luhn algorithm
- **Real-Time Service Display** – Dynamic pricing with admin margin management
- **Order Tracking** – Submit orders and track results with background polling (3-minute intervals)
- **User Authentication** – Supabase Auth (signup/login/session)
- **Admin Margin Management** – Configure markup percentage via Supabase settings table
- **Responsive Design** – Mobile-first dark theme with blue/cyan accents

## Pages

| Path | Description |
|------|-------------|
| `/` | Hero landing with IMEI search |
| `/imei-check` | IMEI input + service selection + results |
| `/services` | Browse all available services |
| `/dashboard` | User stats and quick check |
| `/orders` | Order history with result details |
| `/login` | Supabase authentication |
| `/register` | New account creation |
| `/contact` | Contact form |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 18, TypeScript |
| Styling | Tailwind CSS v3 (dark theme) |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions) |
| Hosting | Vercel |
| External API | IMEI24 API |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- An [IMEI24](https://imei24.com) API key

### 1. Clone and install

```bash
git clone https://github.com/kobkiller26-design/imei-insight.git
cd imei-insight
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
IMEI_API_KEY=your-imei24-api-key
CRON_SECRET=your-random-secret
```

### 3. Set up database

Run the migration in your Supabase SQL editor:

```bash
# Copy contents of supabase/migrations/001_initial_schema.sql
# and paste into Supabase Dashboard > SQL Editor
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

1. Import repo at [vercel.com/new](https://vercel.com/new)
2. Add environment variables (see `.env.example`)
3. Deploy – Vercel auto-detects Next.js

### Background Polling

Set up a cron job to call every 3 minutes:

```
GET /api/poll-orders
Authorization: Bearer YOUR_CRON_SECRET
```

### Service Sync

Schedule a daily call to:

```
GET /api/sync-services
Authorization: Bearer YOUR_CRON_SECRET
```

## Database Schema

```
services
├── id UUID
├── api_service_id TEXT (unique)
├── name TEXT
├── api_price NUMERIC
├── sell_price NUMERIC  ← api_price × (1 + margin%)
├── delivery_time TEXT
├── category TEXT
└── active BOOLEAN

orders
├── id UUID
├── user_id UUID → auth.users
├── imei TEXT
├── service_id UUID → services
├── api_order_id TEXT
├── status TEXT  (pending|processing|completed|failed)
├── result JSONB
└── price NUMERIC

settings
└── margin_percent = "20" (default)
```

## Security

- Row Level Security (RLS) on all tables
- Users can only access their own orders
- Cron endpoints protected by `CRON_SECRET` header
- Security headers via `next.config.js`
- No secrets committed to source code

## License

MIT

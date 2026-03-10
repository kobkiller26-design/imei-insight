#!/usr/bin/env bash
set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     IMEI Insight - Local Setup       ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Check prerequisites ──────────────────────────────────────────────────────
echo "🔍 Checking prerequisites..."

if ! command -v node &>/dev/null; then
  echo "❌  Node.js is not installed."
  echo "    Please install Node.js 18 or later from https://nodejs.org"
  exit 1
fi

NODE_VERSION_FULL=$(node --version 2>/dev/null | tr -d 'v')
NODE_VERSION="${NODE_VERSION_FULL%%.*}"
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 18 ] 2>/dev/null; then
  echo "❌  Node.js ${NODE_VERSION_FULL:-unknown} is too old or version could not be detected."
  echo "    Please upgrade to Node.js 18+ from https://nodejs.org"
  exit 1
fi
echo "✅  Node.js v${NODE_VERSION_FULL} detected"

if ! command -v npm &>/dev/null; then
  echo "❌  npm is not installed."
  exit 1
fi
echo "✅  npm $(npm --version) detected"

# ── Install dependencies ─────────────────────────────────────────────────────
echo ""
echo "📦 Installing dependencies..."
npm install
echo "✅  Dependencies installed"

# ── Environment variables ────────────────────────────────────────────────────
echo ""
echo "🔑 Checking environment variables..."

if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "⚠️   .env.local created from .env.example"
    echo "    Please edit .env.local and add your actual API keys:"
    echo ""
    echo "    IMEI_API_KEY=your_key_here"
    echo "    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo ""
  else
    echo "IMEI_API_KEY=" > .env.local
    echo "⚠️   .env.local created. Please add your API keys."
  fi
else
  echo "✅  .env.local found"
fi

# Check required variables
source .env.local 2>/dev/null || true
MISSING_VARS=()

if [ -z "$IMEI_API_KEY" ] && [ -z "$IMEI24_API_KEY" ]; then
  MISSING_VARS+=("IMEI_API_KEY")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo ""
  echo "⚠️   Missing environment variables in .env.local:"
  for var in "${MISSING_VARS[@]}"; do
    echo "    - $var"
  done
  echo ""
  echo "    The app will start but IMEI checks will fail until keys are added."
fi

# ── Install Vercel CLI if needed ──────────────────────────────────────────────
if ! command -v vercel &>/dev/null; then
  echo ""
  echo "📥 Installing Vercel CLI..."
  npm install -g vercel
  echo "✅  Vercel CLI installed"
else
  echo "✅  Vercel CLI $(vercel --version 2>/dev/null | head -1) detected"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════╗"
echo "║         ✅  Setup Complete!          ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "  To start the development server:"
echo ""
echo "    npm run dev"
echo ""
echo "  Then open: http://localhost:3000"
echo ""
echo "  To run tests:"
echo ""
echo "    npm test"
echo ""

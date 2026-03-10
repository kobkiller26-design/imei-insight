#!/usr/bin/env bash
set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   IMEI Insight - Deploy to Vercel    ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Pre-deployment checks ────────────────────────────────────────────────────
echo "🔍 Running pre-deployment checks..."

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌  Node.js is not installed."
  exit 1
fi
echo "✅  Node.js $(node --version)"

# Check dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi
echo "✅  Dependencies ready"

# ── Run tests ────────────────────────────────────────────────────────────────
echo ""
echo "🧪 Running tests..."
npm test

echo ""
echo "✅  All tests passed!"

# ── Check Vercel CLI ─────────────────────────────────────────────────────────
echo ""
echo "🔍 Checking Vercel CLI..."
if ! command -v vercel &>/dev/null; then
  echo "📥 Installing Vercel CLI..."
  npm install -g vercel
fi
echo "✅  Vercel CLI ready"

# ── Deploy ───────────────────────────────────────────────────────────────────
echo ""
echo "🚀 Deploying to Vercel..."

if [ "$1" = "--prod" ] || [ "$CI" = "true" ]; then
  vercel --prod --yes
else
  echo "  Deploying preview (use --prod for production)..."
  vercel --yes
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       ✅  Deployment complete!       ║"
echo "╚══════════════════════════════════════╝"
echo ""

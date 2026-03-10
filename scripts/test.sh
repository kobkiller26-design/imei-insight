#!/usr/bin/env bash
set -e

echo ""
echo "🧪 Running IMEI Insight test suite..."
echo ""

# Run tests with coverage
npm run test:coverage

echo ""
echo "✅  All tests complete!"
echo ""

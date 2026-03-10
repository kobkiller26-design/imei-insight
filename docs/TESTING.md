# Testing Guide

## Overview

The test suite uses **Jest** with Babel transformation, allowing TypeScript test files to import the plain-JavaScript API handlers.

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file save)
npm run test:watch

# With coverage report
npm run test:coverage
```

## Test File

`tests/api/check.test.ts` — comprehensive tests for the `/api/check` route.

### Scenarios Covered

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Valid 15-digit IMEI | `200 { success: true, data: {...} }` |
| 2 | IMEI too short (<15 digits) | `400 { error: "Invalid IMEI..." }` |
| 3 | IMEI too long (>15 digits) | `400 { error: "Invalid IMEI..." }` |
| 4 | Non-numeric IMEI (letters) | `400 { error: "Invalid IMEI..." }` |
| 5 | Non-numeric IMEI (special chars) | `400 { error: "Invalid IMEI..." }` |
| 6 | Missing IMEI (empty body) | `400 { error: "IMEI required" }` |
| 7 | Missing IMEI (null value) | `400 { error: "IMEI required" }` |
| 8 | `IMEI_API_KEY` env var not set | `500 { error: "API key not configured" }` |
| 9 | IMEI.org returns 503 | `502 { error: "IMEI API request failed..." }` |
| 10 | IMEI.org returns 401 | `502 { error: "IMEI API request failed..." }` |
| 11 | Network timeout | `504 { error: "Request timed out" }` |
| 12 | Generic network error | `500 { error: "Server error", details: "..." }` |
| 13 | Full response parsed correctly | All fields forwarded |
| 14 | Correct request sent to IMEI.org | URL, method, headers, body verified |
| 15 | GET request (wrong method) | `405 { error: "Method not allowed" }` |

## Configuration Files

- `jest.config.js` — Jest configuration (Babel transform, test file patterns)
- `babel.config.js` — Babel presets for Node-targeted JS + TypeScript
- `package.json` — `test` and `test:watch` scripts

## Adding New Tests

Create files in `tests/` matching the pattern `**/*.test.ts` or `**/*.test.js`.

Mock `fetch` globally:

```typescript
const mockFetch = jest.fn()
;(global as any).fetch = mockFetch
```

Mock environment variables:

```typescript
beforeEach(() => {
  process.env.IMEI_API_KEY = 'test-key'
})
afterEach(() => {
  delete process.env.IMEI_API_KEY
})
```

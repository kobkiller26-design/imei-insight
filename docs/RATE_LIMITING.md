# Rate Limiting Guide

## Overview

The rate limiting system (`lib/rateLimit.js`) uses an **in-memory sliding-window** algorithm to prevent API abuse.

## Limits

| Dimension | Limit | Window |
|-----------|-------|--------|
| Per user (by email) | 10 checks | 1 hour |
| Per IP address | 100 checks | 1 hour |

Both limits apply simultaneously. A request is rejected if either limit is exceeded.

## Admin Bypass

Users with `is_admin: true` are exempt from per-user rate limits. IP limits still apply to all traffic.

## HTTP Response

When a limit is exceeded the API returns:

```
HTTP 429 Too Many Requests
Retry-After: <seconds until reset>
X-RateLimit-Remaining: 0
X-RateLimit-Reset: <ISO 8601 timestamp>
```

Body:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3542,
  "resetAt": "2024-01-01T14:00:00.000Z"
}
```

## Quota Display

The `X-RateLimit-Remaining` header is included in every successful response, letting the frontend show remaining checks:

```
X-RateLimit-Remaining: 7
```

## Implementation Notes

- Limits are tracked in-memory per process. In a serverless environment (Vercel) each function instance has its own counter — use Redis for shared state across instances.
- The sliding window resets naturally: old timestamps (>1 hour ago) are discarded on each request.
- `_resetStores()` is exported for use in tests.

## Upgrading to Redis

Replace the in-memory `userRequests` / `ipRequests` objects with Redis `INCR` + `EXPIRE`:

```javascript
import { createClient } from 'redis'
const redis = createClient({ url: process.env.REDIS_URL })

async function checkRedisLimit(key, limit, windowSec) {
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, windowSec)
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
}
```

Set `REDIS_URL` in your environment and the rest of the API is unchanged.

# Admin Dashboard Guide

## Overview

The admin dashboard at `/admin.html` provides a management interface for viewing and exporting all IMEI checks.

## Access

Only users with `is_admin: true` in the users table can access the admin dashboard. The dashboard performs an authentication check on load and after login — non-admin users see a 403 error.

## Features

### Statistics Panel
- **Total Checks** — all-time number of IMEI checks
- **Today's Checks** — checks performed today (UTC)
- **Total Users** — registered user count
- **Top Brands** — top 5 device brands checked

### Checks Table
Paginated (50 per page) table showing:

| Column | Description |
|--------|-------------|
| IMEI | The 15-digit IMEI number |
| User | Email of the user who ran the check (or "anon") |
| Brand | Device brand from API response |
| Model | Device model from API response |
| Blacklist | Status badge (Clean / Blacklisted / N/A) |
| Date | Timestamp of the check |

Click **Details** on any row to see the full JSON response.

### Filtering & Search

| Filter | Description |
|--------|-------------|
| User | Partial match on user email |
| IMEI | Partial match on IMEI number |
| Status | Clean or Blacklisted |
| From / To | Date range filter |

Click **Reset** to clear all filters.

### Export

- **Export My Checks** — downloads only the current user's checks as CSV
- **Export All (Admin)** — downloads all checks as CSV (admin only)

Both buttons respect the active date-range filters.

## API Endpoint

`GET /api/admin-checks`

### Query Parameters

| Param | Description |
|-------|-------------|
| `page` | Page number (default: 1) |
| `user` | Filter by user email substring |
| `imei` | Filter by IMEI substring |
| `status` | `clean` or `blacklisted` |
| `from` | Start date (YYYY-MM-DD) |
| `to` | End date (YYYY-MM-DD) |

### Response

```json
{
  "checks": [...],
  "total": 100,
  "page": 1,
  "pageSize": 50,
  "totalPages": 2,
  "stats": {
    "totalChecks": 500,
    "todayChecks": 12,
    "topBrands": [{ "brand": "Apple", "count": 150 }],
    "totalUsers": 30
  }
}
```

Requires `Authorization: <token>` header and admin role.

## Setting Up Admin Users

In `lib/db.js`, users are stored in memory. To create an admin user, call `createUser` with `is_admin: true`. In production, update your Supabase `users` table:

```sql
UPDATE users SET is_admin = TRUE WHERE email = 'admin@example.com';
```

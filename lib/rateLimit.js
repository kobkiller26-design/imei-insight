const userRequests = {}
const ipRequests = {}

const USER_LIMIT = 10 // per hour per user
const IP_LIMIT = 100 // per hour per IP
export const HOUR_IN_MS = 60 * 60 * 1000 // 1 hour in milliseconds
/** @deprecated Use HOUR_IN_MS */
export const WINDOW_MS = HOUR_IN_MS

function getRecent(store, key) {
  const now = Date.now()
  if (!store[key]) store[key] = []
  store[key] = store[key].filter(t => now - t < WINDOW_MS)
  return store[key]
}

export function checkUserLimit(userId, isAdmin = false) {
  if (isAdmin) {
    return { allowed: true, remaining: USER_LIMIT, resetAt: null, retryAfter: 0 }
  }

  const now = Date.now()
  const requests = getRecent(userRequests, userId)
  const count = requests.length

  if (count >= USER_LIMIT) {
    const oldest = Math.min(...requests)
    const resetAt = new Date(oldest + WINDOW_MS).toISOString()
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000)
    return { allowed: false, remaining: 0, resetAt, retryAfter }
  }

  requests.push(now)
  return { allowed: true, remaining: USER_LIMIT - requests.length, resetAt: null, retryAfter: 0 }
}

export function checkIPLimit(ip) {
  const now = Date.now()
  const requests = getRecent(ipRequests, ip)
  const count = requests.length

  if (count >= IP_LIMIT) {
    const oldest = Math.min(...requests)
    const resetAt = new Date(oldest + WINDOW_MS).toISOString()
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000)
    return { allowed: false, remaining: 0, resetAt, retryAfter }
  }

  requests.push(now)
  return { allowed: true, remaining: IP_LIMIT - requests.length, resetAt: null, retryAfter: 0 }
}

export function getRemainingChecks(userId, isAdmin = false) {
  if (isAdmin) return USER_LIMIT

  const now = Date.now()
  if (!userRequests[userId]) return USER_LIMIT

  const recent = userRequests[userId].filter(t => now - t < WINDOW_MS)
  return Math.max(0, USER_LIMIT - recent.length)
}

// Exported for testing – resets in-memory stores
export function _resetStores() {
  Object.keys(userRequests).forEach(k => delete userRequests[k])
  Object.keys(ipRequests).forEach(k => delete ipRequests[k])
}

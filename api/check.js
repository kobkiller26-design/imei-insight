import { addIMEICheck } from '../lib/db.js'
import { checkUserLimit, checkIPLimit } from '../lib/rateLimit.js'
import { verifyToken } from '../lib/auth.js'

const IMEI_API_URL = 'https://api-client.imei.org/api/ihru'

export async function callIMEIOrg(imei) {
  const apiKey = process.env.IMEI_API_KEY || process.env.IMEI24_API_KEY

  if (!apiKey) {
    const err = new Error('API key not configured')
    err.code = 'API_KEY_MISSING'
    throw err
  }

  const response = await fetch(IMEI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imei })
  })

  if (!response.ok) {
    const err = new Error(`IMEI API request failed with status ${response.status}`)
    err.code = 'API_FAILURE'
    err.apiStatus = response.status
    throw err
  }

  return response.json()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imei } = req.body || {}

  if (!imei) {
    return res.status(400).json({ error: 'IMEI required' })
  }

  if (!/^\d{15}$/.test(String(imei))) {
    return res.status(400).json({ error: 'Invalid IMEI: must be exactly 15 digits' })
  }

  const apiKey = process.env.IMEI_API_KEY || process.env.IMEI24_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  // Rate limiting
  const token = req.headers.authorization
  const user = token ? verifyToken(token) : null
  const isAdmin = user?.is_admin === true

  if (user) {
    const userLimit = checkUserLimit(user.email, isAdmin)
    if (!userLimit.allowed) {
      res.setHeader('Retry-After', String(userLimit.retryAfter))
      res.setHeader('X-RateLimit-Remaining', '0')
      res.setHeader('X-RateLimit-Reset', userLimit.resetAt)
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: userLimit.retryAfter,
        resetAt: userLimit.resetAt
      })
    }
    res.setHeader('X-RateLimit-Remaining', String(userLimit.remaining))
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  const ipLimit = checkIPLimit(ip)
  if (!ipLimit.allowed) {
    res.setHeader('Retry-After', String(ipLimit.retryAfter))
    return res.status(429).json({
      error: 'Too many requests from this IP',
      retryAfter: ipLimit.retryAfter,
      resetAt: ipLimit.resetAt
    })
  }

  try {
    const data = await callIMEIOrg(imei)

    addIMEICheck({
      user_id: user?.email || null,
      imei,
      result: data,
      created_at: new Date().toISOString()
    })

    return res.status(200).json({ success: true, data })
  } catch (error) {
    if (error.code === 'API_KEY_MISSING') {
      return res.status(500).json({ error: 'API key not configured' })
    }
    if (error.code === 'API_FAILURE') {
      return res.status(502).json({ error: 'IMEI API request failed', apiStatus: error.apiStatus })
    }
    if (error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      return res.status(504).json({ error: 'Request timed out' })
    }
    return res.status(500).json({ error: 'Server error', details: error.message })
  }
}

import { requireAdmin } from '../lib/adminAuth.js'
import { getAllIMEIChecks, getUsers } from '../lib/db.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const admin = requireAdmin(req, res)
  if (!admin) return

  const checks = getAllIMEIChecks()

  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const pageSize = 50
  const total = checks.length

  // Filter by user
  let filtered = checks
  if (req.query.user) {
    filtered = filtered.filter(c => c.user_id && c.user_id.includes(req.query.user))
  }

  // Filter by IMEI
  if (req.query.imei) {
    filtered = filtered.filter(c => c.imei && c.imei.includes(req.query.imei))
  }

  // Filter by status (checks blacklistStatus in result_json)
  if (req.query.status) {
    filtered = filtered.filter(c =>
      c.result_json?.blacklistStatus?.toLowerCase() === req.query.status.toLowerCase()
    )
  }

  // Filter by date range
  if (req.query.from) {
    const from = new Date(req.query.from)
    filtered = filtered.filter(c => new Date(c.created_at) >= from)
  }
  if (req.query.to) {
    const to = new Date(req.query.to)
    to.setHours(23, 59, 59, 999)
    filtered = filtered.filter(c => new Date(c.created_at) <= to)
  }

  const filteredTotal = filtered.length
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  // Statistics
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayChecks = checks.filter(c => new Date(c.created_at) >= today).length

  const brandCount = {}
  checks.forEach(c => {
    const brand = c.result_json?.brand
    if (brand) brandCount[brand] = (brandCount[brand] || 0) + 1
  })
  const topBrands = Object.entries(brandCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([brand, count]) => ({ brand, count }))

  res.status(200).json({
    checks: paged,
    total: filteredTotal,
    page,
    pageSize,
    totalPages: Math.ceil(filteredTotal / pageSize),
    stats: {
      totalChecks: total,
      todayChecks,
      topBrands,
      totalUsers: getUsers().length
    }
  })
}

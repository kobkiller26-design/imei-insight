import { verifyToken } from '../lib/auth.js'
import { findUser, getAllIMEIChecks, getIMEIChecks } from '../lib/db.js'

function escapeCSV(value) {
  if (value === null || value === undefined) return '""'
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return '"' + str + '"'
}

function buildCSV(rows) {
  if (!rows.length) return '\uFEFF' + 'IMEI,Brand,Model,Status,Blacklist,Date\n'
  const headers = ['IMEI', 'Brand', 'Model', 'Status', 'Blacklist', 'Date']
  const lines = [headers.map(escapeCSV).join(',')]
  rows.forEach(row => {
    lines.push([
      escapeCSV(row.IMEI),
      escapeCSV(row.Brand),
      escapeCSV(row.Model),
      escapeCSV(row.Status),
      escapeCSV(row.Blacklist),
      escapeCSV(row.Date)
    ].join(','))
  })
  return '\uFEFF' + lines.join('\n')
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.headers.authorization
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ error: 'Login required' })
  }

  const dbUser = findUser(decoded.email)
  const isAdmin = dbUser?.is_admin === true

  let checks
  if (req.query.all === 'true' && isAdmin) {
    checks = getAllIMEIChecks()
  } else {
    checks = getIMEIChecks(decoded.email)
  }

  // Filter by date range
  if (req.query.from) {
    const from = new Date(req.query.from)
    checks = checks.filter(c => new Date(c.created_at) >= from)
  }
  if (req.query.to) {
    const to = new Date(req.query.to)
    to.setHours(23, 59, 59, 999)
    checks = checks.filter(c => new Date(c.created_at) <= to)
  }

  const rows = checks.map(c => ({
    IMEI: c.imei,
    Brand: c.result_json?.brand || '',
    Model: c.result_json?.deviceModel || '',
    Status: c.result_json?.imeiStatus || '',
    Blacklist: c.result_json?.blacklistStatus || '',
    Date: c.created_at
  }))

  const csv = buildCSV(rows)
  const date = new Date().toISOString().split('T')[0]

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="imei_checks_${date}.csv"`)
  res.status(200).send(csv)
}

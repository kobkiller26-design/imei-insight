import { verifyToken } from './auth.js'
import { findUser } from './db.js'

export function getAdminUser(token) {
  if (!token) return null
  const decoded = verifyToken(token)
  if (!decoded) return null
  const user = findUser(decoded.email)
  if (!user || !user.is_admin) return null
  return user
}

export function requireAdmin(req, res) {
  const token = req.headers.authorization
  const admin = getAdminUser(token)
  if (!admin) {
    res.status(403).json({ error: 'Admin access required' })
    return null
  }
  return admin
}

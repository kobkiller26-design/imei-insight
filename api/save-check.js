import { saveIMEICheck } from "../lib/supabase.js"

/**
 * POST /api/save-check
 * Body: { imei, result, userEmail? }
 *
 * Saves an IMEI check result to Supabase.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { imei, result, userEmail } = req.body || {}

  if (!imei || !result) {
    return res.status(400).json({ error: "imei and result are required" })
  }

  const { saved, error } = await saveIMEICheck({ imei, result, userEmail })

  if (!saved) {
    return res.status(500).json({ error: error || "Failed to save" })
  }

  return res.status(200).json({ success: true })
}

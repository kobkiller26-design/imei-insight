import { validateIMEI } from "../lib/imei.js"
import { saveIMEICheck } from "../lib/supabase.js"

/**
 * GET /api/check?imei=<15-digit IMEI>
 * POST /api/check  body: { imei }
 *
 * Validates the IMEI, calls the IMEI24/IMEI.org API,
 * saves the result to Supabase, and returns a structured response.
 */
export default async function handler(req, res) {
  // Allow both GET and POST
  const imei =
    req.method === "POST"
      ? (req.body && req.body.imei)
      : req.query.imei

  // --- IMEI validation ---
  const validation = validateIMEI(imei)
  if (!validation.valid) {
    return res.status(400).json({ status: "error", error: validation.error })
  }

  const cleanIMEI = String(imei).trim()

  // --- API credentials from environment ---
  const apiKey = process.env.IMEI24_API_KEY
  const apiUrl = process.env.IMEI24_API_URL || "https://api-client.imei.org/api/dhru"

  if (!apiKey || apiKey.includes("your_imei24_api_key")) {
    return res.status(500).json({
      status: "error",
      error: "IMEI24_API_KEY is not configured. Please set it in your environment variables."
    })
  }

  try {
    // Build query string for the IMEI24 dhru API
    const params = new URLSearchParams({
      apiaccesskey: apiKey,
      request: "imei",
      imei: cleanIMEI
    })

    const response = await fetch(`${apiUrl}?${params}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })

    if (!response.ok) {
      return res.status(502).json({
        status: "error",
        error: `Upstream API returned HTTP ${response.status}`
      })
    }

    const data = await response.json()

    // Save to Supabase (non-blocking – errors are ignored in response)
    const userEmail = req.headers["x-user-email"] || null
    await saveIMEICheck({ imei: cleanIMEI, result: data, userEmail })

    return res.status(200).json({
      status: "success",
      imei: cleanIMEI,
      result: data
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Server error while checking IMEI",
      details: error.message
    })
  }
}

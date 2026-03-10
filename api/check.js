export default async function handler(req, res) {

  try {

    // Support both GET (legacy dashboard) and POST
    const imei = req.body?.imei || req.query?.imei

    if (!imei) {
      return res.status(400).json({ error: "IMEI required" })
    }

    // Validate: exactly 15 digits
    if (!/^\d{15}$/.test(String(imei))) {
      return res.status(400).json({ error: "Invalid IMEI format. Must be exactly 15 digits." })
    }

    // IMEI_API_KEY is the canonical variable name.
    // IMEI24_API_KEY is kept as a legacy fallback for environments
    // that were configured before this variable was renamed.
    const apiKey = process.env.IMEI_API_KEY || process.env.IMEI24_API_KEY

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" })
    }

    // Call IMEI.org API
    let imeiResult
    try {
      const imeiResponse = await fetch("https://api-client.imei.org/api/ihru", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imei: String(imei) })
      })

      if (!imeiResponse.ok) {
        const errorText = await imeiResponse.text()
        return res.status(imeiResponse.status).json({
          error: "IMEI.org API error",
          details: errorText
        })
      }

      imeiResult = await imeiResponse.json()
    } catch (fetchError) {
      return res.status(502).json({
        error: "Network error contacting IMEI.org",
        details: fetchError.message
      })
    }

    // Save to Supabase if configured (best-effort, non-blocking)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceKey) {
      // Try to resolve user from Supabase auth token
      let userId = null
      const authHeader = req.headers.authorization
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (authHeader && supabaseAnonKey) {
        try {
          const userRes = await fetch(supabaseUrl + "/auth/v1/user", {
            headers: {
              "Authorization": authHeader,
              "apikey": supabaseAnonKey
            }
          })
          if (userRes.ok) {
            const userData = await userRes.json()
            userId = userData.id || null
          }
        } catch (_) {
          // Non-fatal: proceed without user_id
        }
      }

      // Only save when we have a user_id (table enforces NOT NULL)
      if (userId) {
        try {
          await fetch(supabaseUrl + "/rest/v1/imei_checks", {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + supabaseServiceKey,
              "apikey": supabaseServiceKey,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              user_id: userId,
              imei: String(imei),
              result_json: imeiResult
            })
          })
        } catch (_) {
          // Non-fatal: result still returned to user
        }
      }
    }

    return res.status(200).json(imeiResult)

  } catch (error) {

    return res.status(500).json({
      error: "Server error",
      details: error.message
    })

  }

}

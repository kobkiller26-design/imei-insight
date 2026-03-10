export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imei } = req.body

  if (!imei) {
    return res.status(400).json({ error: 'IMEI required' })
  }

  if (!/^\d{15}$/.test(String(imei))) {
    return res.status(400).json({ error: 'IMEI must be exactly 15 digits' })
  }

  const apiKey = process.env.IMEI_API_KEY || process.env.IMEI24_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const apiUrl = process.env.IMEI_API_URL || 'https://api-client.imei.org/api/ihru'

  try {

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imei: String(imei) })
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      return res.status(502).json({
        error: 'IMEI check service unavailable',
        details: errorText || `HTTP ${response.status}`
      })
    }

    const data = await response.json()

    await saveToSupabase(imei, data).catch(() => {})

    return res.status(200).json({ success: true, data })

  } catch (error) {

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(503).json({ error: 'Network error. Please try again.' })
    }

    return res.status(500).json({
      error: 'Server error',
      details: error.message
    })

  }

}

async function saveToSupabase(imei, resultJson) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    return
  }

  try {

    await fetch(`${supabaseUrl}/rest/v1/imei_checks`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        imei,
        result_json: resultJson,
        created_at: new Date().toISOString()
      })
    })

  } catch {
    // Don't fail the main response if Supabase save fails
  }

}

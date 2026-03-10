import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY

/**
 * Returns a Supabase client, or null when credentials are not configured.
 * API routes should check for null and skip DB operations gracefully.
 */
export function getSupabaseClient() {
  if (!url || !key || url.includes("your-project") || key.includes("your_supabase")) {
    return null
  }
  return createClient(url, key)
}

/**
 * Save an IMEI check result to the imei_checks table.
 * Silently skips when Supabase is not configured.
 *
 * @param {{ imei: string, result: object, userEmail?: string }} data
 * @returns {Promise<{ saved: boolean, error?: string }>}
 */
export async function saveIMEICheck({ imei, result, userEmail }) {
  const client = getSupabaseClient()
  if (!client) {
    return { saved: false, error: "Supabase not configured" }
  }
  const { error } = await client.from("imei_checks").insert({
    imei,
    result,
    user_email: userEmail || null,
    checked_at: new Date().toISOString()
  })
  if (error) {
    return { saved: false, error: error.message }
  }
  return { saved: true }
}

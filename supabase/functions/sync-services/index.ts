// Supabase Edge Function: sync-services
// Runs on a schedule to import services from IMEI24 API

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface IMEI24Service {
  id: string
  name: string
  price: number
  delivery_time: string
  category: string
  description?: string
}

Deno.serve(async (req: Request) => {
  // Allow only POST or schedule invocations
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const imeiApiKey = Deno.env.get('IMEI_API_KEY') ?? ''
  const imeiApiBase = Deno.env.get('IMEI_API_BASE_URL') ?? 'https://api.imei24.com/v1'

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  let syncedCount = 0
  let errorMessage: string | null = null

  try {
    // Fetch services from IMEI24 API
    const response = await fetch(`${imeiApiBase}/services`, {
      headers: {
        Authorization: `Bearer ${imeiApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`IMEI API responded with ${response.status}`)
    }

    const services: IMEI24Service[] = await response.json()

    // Fetch current margin from settings
    const { data: settingData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'margin_percent')
      .single()

    const marginPercent = parseFloat(settingData?.value ?? '20')

    // Upsert services into database
    for (const service of services) {
      const apiPrice = Number(service.price) || 0
      const sellPrice = parseFloat(
        (apiPrice + apiPrice * (marginPercent / 100)).toFixed(4)
      )

      const { error } = await supabase.from('services').upsert(
        {
          api_service_id: service.id,
          name: service.name,
          api_price: apiPrice,
          sell_price: sellPrice,
          delivery_time: service.delivery_time ?? 'Unknown',
          category: service.category ?? 'Info',
          description: service.description ?? null,
          active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'api_service_id' }
      )

      if (error) {
        console.error('Error upserting service:', service.id, error.message)
      } else {
        syncedCount++
      }
    }

    // Log successful sync
    await supabase.from('sync_logs').insert({
      sync_type: 'services',
      status: 'success',
      message: `Synced ${syncedCount} services`,
    })

    return new Response(
      JSON.stringify({ success: true, synced: syncedCount }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err)
    console.error('Service sync failed:', errorMessage)

    // Log failed sync
    try {
      const supabaseErr = createClient(supabaseUrl, serviceRoleKey)
      await supabaseErr.from('sync_logs').insert({
        sync_type: 'services',
        status: 'error',
        message: errorMessage,
      })
    } catch {
      // ignore logging error
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

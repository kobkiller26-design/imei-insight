import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { fetchServices } from '@/lib/imei-api'
import { calculateSellPrice } from '@/lib/utils'

const FALLBACK_MARGIN_PERCENT = 20

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const providedSecret = req.headers.get('x-cron-secret')

  if (!cronSecret || providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const apiServices = await fetchServices()

    if (!apiServices || apiServices.length === 0) {
      return NextResponse.json({ synced: 0, message: 'No services returned from API' })
    }

    const serverClient = createServerClient()

    // Fetch margin from settings table; fall back to 20% if not configured
    const { data: settingData } = await serverClient
      .from('settings')
      .select('value')
      .eq('key', 'margin_percent')
      .single()
    const marginPercent = parseFloat(settingData?.value ?? String(FALLBACK_MARGIN_PERCENT))

    const upsertRows = apiServices.map((service) => ({
      api_service_id: service.id,
      name: service.name,
      api_price: service.price,
      sell_price: calculateSellPrice(service.price, marginPercent),
      delivery_time: service.delivery_time,
      category: service.category,
      description: service.description ?? null,
      active: true,
      updated_at: new Date().toISOString(),
    }))

    const { error: upsertError } = await serverClient
      .from('services')
      .upsert(upsertRows, { onConflict: 'api_service_id' })

    if (upsertError) throw upsertError

    // Log the sync
    await serverClient.from('sync_logs').insert({
      sync_type: 'services',
      status: 'success',
      message: `Synced ${upsertRows.length} services`,
    })

    return NextResponse.json({ synced: upsertRows.length })
  } catch (err) {
    console.error('[sync-services] error:', err)

    // Attempt to log the failure — ignore errors from the log insert itself
    try {
      const serverClient = createServerClient()
      await serverClient.from('sync_logs').insert({
        sync_type: 'services',
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    } catch {
      // Ignore secondary logging failures
    }

    return NextResponse.json({ error: 'Failed to sync services' }, { status: 500 })
  }
}

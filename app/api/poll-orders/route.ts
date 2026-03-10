import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getOrderResult } from '@/lib/imei-api'

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const providedSecret = req.headers.get('x-cron-secret')

  if (!cronSecret || providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let processed = 0
  let updated = 0

  try {
    const serverClient = createServerClient()

    // Fetch all pending or processing orders that have an external API order ID
    const { data: pendingOrders, error: fetchError } = await serverClient
      .from('orders')
      .select('id, api_order_id, status')
      .in('status', ['pending', 'processing'])
      .not('api_order_id', 'is', null)
      .limit(50)

    if (fetchError) throw fetchError

    if (!pendingOrders || pendingOrders.length === 0) {
      return NextResponse.json({ processed: 0, updated: 0 })
    }

    for (const order of pendingOrders) {
      processed++
      try {
        const result = await getOrderResult(order.api_order_id as string)
        const newStatus =
          result.status === 'completed' || result.status === 'failed'
            ? result.status
            : order.status

        if (newStatus !== order.status || result.result) {
          const { error: updateError } = await serverClient
            .from('orders')
            .update({
              status: newStatus as 'pending' | 'processing' | 'completed' | 'failed',
              result: result.result ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id)

          if (!updateError) {
            updated++
          } else {
            console.error('[poll-orders] update error for order', order.id, updateError)
          }
        }
      } catch (orderErr) {
        console.error('[poll-orders] failed to poll order', order.id, orderErr)
      }
    }

    return NextResponse.json({ processed, updated })
  } catch (err) {
    console.error('[poll-orders] fatal error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

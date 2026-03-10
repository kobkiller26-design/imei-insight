import { NextRequest, NextResponse } from 'next/server'
import { validateIMEI } from '@/lib/utils'
import { createOrder } from '@/lib/imei-api'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { imei, serviceId } = body as { imei?: unknown; serviceId?: unknown }

  if (typeof imei !== 'string' || typeof serviceId !== 'string') {
    return NextResponse.json(
      { error: 'imei and serviceId are required strings' },
      { status: 400 }
    )
  }

  const validation = validateIMEI(imei)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  if (!serviceId.trim()) {
    return NextResponse.json({ error: 'serviceId is required' }, { status: 400 })
  }

  // If no API key configured, return a mock pending order for demo purposes
  if (!process.env.IMEI_API_KEY) {
    const mockOrderId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    return NextResponse.json({
      orderId: mockOrderId,
      status: 'pending',
      demo: true,
      message: 'Demo mode — configure IMEI_API_KEY to enable live checks.',
    })
  }

  try {
    const order = await createOrder(imei, serviceId)
    return NextResponse.json({
      orderId: order.order_id,
      status: order.status,
    })
  } catch (err) {
    console.error('[imei-check] createOrder error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create order' },
      { status: 502 }
    )
  }
}

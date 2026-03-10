import { NextRequest, NextResponse } from 'next/server'
import { supabase, createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  // Retrieve the auth token from the Authorization header
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate token and get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const serverClient = createServerClient()
    const { data: orders, error } = await serverClient
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(orders)
  } catch (err) {
    console.error('[orders GET] error:', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { imei, service_id, api_order_id, price } = body as {
    imei?: unknown
    service_id?: unknown
    api_order_id?: unknown
    price?: unknown
  }

  if (
    typeof imei !== 'string' ||
    typeof service_id !== 'string' ||
    typeof price !== 'number'
  ) {
    return NextResponse.json(
      { error: 'imei (string), service_id (string), and price (number) are required' },
      { status: 400 }
    )
  }

  try {
    const serverClient = createServerClient()
    const { data: order, error } = await serverClient
      .from('orders')
      .insert({
        user_id: user.id,
        imei,
        service_id,
        api_order_id: typeof api_order_id === 'string' ? api_order_id : null,
        status: 'pending',
        price,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error('[orders POST] error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

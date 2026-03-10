const IMEI_API_KEY = process.env.IMEI_API_KEY
const IMEI_API_BASE_URL = process.env.IMEI_API_BASE_URL || 'https://api.imei24.com/v1'

export interface IMEI24Service {
  id: string
  name: string
  price: number
  delivery_time: string
  category: string
  description?: string
}

export interface IMEI24OrderResponse {
  order_id: string
  status: string
  message?: string
}

export interface IMEI24OrderResult {
  order_id: string
  status: string
  result?: {
    device_model?: string
    brand?: string
    blacklist_status?: string
    carrier_lock?: string
    warranty?: string
    imei_status?: string
    [key: string]: unknown
  }
}

async function imeiApiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  if (!IMEI_API_KEY) {
    throw new Error('IMEI_API_KEY is not configured')
  }

  const response = await fetch(`${IMEI_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${IMEI_API_KEY}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`IMEI API error ${response.status}: ${errorBody}`)
  }

  return response.json()
}

export async function fetchServices(): Promise<IMEI24Service[]> {
  const data = await imeiApiRequest('/services')
  return data as IMEI24Service[]
}

export async function createOrder(
  imei: string,
  serviceId: string
): Promise<IMEI24OrderResponse> {
  const data = await imeiApiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({ imei, service_id: serviceId }),
  })
  return data as IMEI24OrderResponse
}

export async function getOrderResult(orderId: string): Promise<IMEI24OrderResult> {
  const data = await imeiApiRequest(`/orders/${encodeURIComponent(orderId)}`)
  return data as IMEI24OrderResult
}

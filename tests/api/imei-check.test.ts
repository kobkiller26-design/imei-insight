import { describe, it, expect, jest, beforeAll, beforeEach } from '@jest/globals'

// Mock fetch globally before importing handler
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

type Handler = (req: MockRequest, res: MockResponse) => Promise<void>

interface MockRequest {
  method: string
  body: Record<string, unknown>
  query?: Record<string, string>
}

interface MockResponse {
  status: jest.MockedFunction<(code: number) => MockResponse>
  json: jest.MockedFunction<(data: unknown) => void>
}

let handler: Handler

beforeAll(async () => {
  const module = await import('../../api/check.js') as { default: Handler }
  handler = module.default
})

describe('/api/check - IMEI validation', () => {
  let mockReq: MockRequest
  let mockRes: MockResponse

  beforeEach(() => {
    mockFetch.mockClear()
    mockReq = {
      method: 'POST',
      body: {}
    }
    mockRes = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => MockResponse>,
      json: jest.fn() as jest.MockedFunction<(data: unknown) => void>
    }
  })

  it('returns 405 for GET requests', async () => {
    mockReq.method = 'GET'
    await handler(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(405)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Method not allowed' })
    )
  })

  it('returns 400 if IMEI is missing', async () => {
    mockReq.body = {}
    await handler(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'IMEI required' })
    )
  })

  it('returns 400 for IMEI shorter than 15 digits', async () => {
    mockReq.body = { imei: '12345678901234' } // 14 digits
    await handler(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'IMEI must be exactly 15 digits' })
    )
  })

  it('returns 400 for IMEI longer than 15 digits', async () => {
    mockReq.body = { imei: '1234567890123456' } // 16 digits
    await handler(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'IMEI must be exactly 15 digits' })
    )
  })

  it('returns 400 for non-numeric IMEI', async () => {
    mockReq.body = { imei: '35907215709582A' } // has letter
    await handler(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'IMEI must be exactly 15 digits' })
    )
  })
})

describe('/api/check - API integration', () => {
  let mockReq: MockRequest
  let mockRes: MockResponse
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    mockFetch.mockClear()
    mockReq = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    mockRes = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => MockResponse>,
      json: jest.fn() as jest.MockedFunction<(data: unknown) => void>
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns 500 if no API key is configured', async () => {
    delete process.env.IMEI_API_KEY
    delete process.env.IMEI24_API_KEY
    await handler(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'API key not configured' })
    )
  })

  it('calls IMEI.org API with Bearer token authorization', async () => {
    process.env.IMEI_API_KEY = 'test-api-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = ''

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deviceModel: 'iPhone 12', brand: 'Apple' })
    } as Response)

    await handler(mockReq, mockRes)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('imei.org'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json'
        })
      })
    )
  })

  it('sends IMEI in the request body', async () => {
    process.env.IMEI_API_KEY = 'test-api-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = ''

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deviceModel: 'Samsung Galaxy S21' })
    } as Response)

    await handler(mockReq, mockRes)

    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1]?.body as string)
    expect(requestBody).toEqual({ imei: '359072157095826' })
  })

  it('returns success with device data on valid IMEI', async () => {
    process.env.IMEI_API_KEY = 'test-api-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = ''

    const mockDeviceData = {
      deviceModel: 'iPhone 12 Pro',
      brand: 'Apple',
      imeiStatus: 'Valid',
      blacklistStatus: 'Clean',
      carrier: 'Verizon',
      country: 'United States'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDeviceData
    } as Response)

    await handler(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: mockDeviceData
    })
  })

  it('returns 502 when IMEI.org API is unavailable', async () => {
    process.env.IMEI_API_KEY = 'test-api-key'

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => 'Service Unavailable'
    } as Response)

    await handler(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(502)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'IMEI check service unavailable' })
    )
  })

  it('returns 503 on network error', async () => {
    process.env.IMEI_API_KEY = 'test-api-key'

    mockFetch.mockRejectedValueOnce(
      Object.assign(new TypeError('fetch failed'), { name: 'TypeError' })
    )

    await handler(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(503)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Network error. Please try again.' })
    )
  })

  it('uses IMEI24_API_KEY as fallback when IMEI_API_KEY is not set', async () => {
    delete process.env.IMEI_API_KEY
    process.env.IMEI24_API_KEY = 'fallback-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = ''

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deviceModel: 'Test Device' })
    } as Response)

    await handler(mockReq, mockRes)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fallback-key'
        })
      })
    )
  })
})

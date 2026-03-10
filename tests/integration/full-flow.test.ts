import { describe, it, expect, jest, beforeAll, beforeEach, afterEach } from '@jest/globals'

// Mock fetch globally
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

type Handler = (req: MockRequest, res: MockResponse) => Promise<void>

interface MockRequest {
  method: string
  body: Record<string, unknown>
}

interface MockResponse {
  status: jest.MockedFunction<(code: number) => MockResponse>
  json: jest.MockedFunction<(data: unknown) => void>
}

let checkHandler: Handler

beforeAll(async () => {
  const module = await import('../../api/check.js') as { default: Handler }
  checkHandler = module.default
})

describe('Full IMEI Check User Flow', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.IMEI_API_KEY = 'integration-test-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = ''
    mockFetch.mockClear()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  const createMockRes = (): MockResponse => ({
    status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => MockResponse>,
    json: jest.fn() as jest.MockedFunction<(data: unknown) => void>
  })

  it('complete flow: valid IMEI → API call → device information returned', async () => {
    const expectedDeviceData = {
      deviceModel: 'iPhone 12 Pro',
      brand: 'Apple',
      imeiStatus: 'Valid',
      blacklistStatus: 'Clean',
      carrier: 'Verizon',
      country: 'United States'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => expectedDeviceData
    } as Response)

    const req: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const res = createMockRes()

    await checkHandler(req, res)

    // Verify success response
    expect(mockRes(res).status).toHaveBeenCalledWith(200)
    expect(mockRes(res).json).toHaveBeenCalledWith({
      success: true,
      data: expectedDeviceData
    })
  })

  it('flow: user enters invalid IMEI format → gets clear error message', async () => {
    const invalidIMEIs = [
      '12345',           // too short
      '1234567890123456', // too long
      'ABCDEFGHIJKLMNO', // non-numeric
      '',                // empty
    ]

    for (const invalidIMEI of invalidIMEIs) {
      const req: MockRequest = {
        method: 'POST',
        body: { imei: invalidIMEI }
      }
      const res = createMockRes()

      await checkHandler(req, res)

      // Should never call external API for invalid IMEI
      expect(mockFetch).not.toHaveBeenCalled()

      // Should return 4xx error
      const statusCall = mockRes(res).status.mock.calls[0]?.[0]
      expect(statusCall).toBeGreaterThanOrEqual(400)
      expect(statusCall).toBeLessThan(500)

      mockFetch.mockClear()
    }
  })

  it('flow: IMEI.org API failure → user gets graceful error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => 'Service Unavailable'
    } as Response)

    const req: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const res = createMockRes()

    await checkHandler(req, res)

    expect(mockRes(res).status).toHaveBeenCalledWith(502)
    expect(mockRes(res).json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('unavailable') })
    )
  })

  it('flow: missing API key → user gets configuration error', async () => {
    delete process.env.IMEI_API_KEY
    delete process.env.IMEI24_API_KEY

    const req: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const res = createMockRes()

    await checkHandler(req, res)

    // No external API call should be made
    expect(mockFetch).not.toHaveBeenCalled()
    expect(mockRes(res).status).toHaveBeenCalledWith(500)
  })

  it('flow: network error → user gets retry message', async () => {
    mockFetch.mockRejectedValueOnce(
      Object.assign(new TypeError('fetch failed'), { name: 'TypeError' })
    )

    const req: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const res = createMockRes()

    await checkHandler(req, res)

    expect(mockRes(res).status).toHaveBeenCalledWith(503)
    expect(mockRes(res).json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Network error') })
    )
  })

  it('flow: complete with Supabase storage → check saved to database', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://real-project.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'

    const deviceData = { deviceModel: 'Samsung Galaxy S21', brand: 'Samsung' }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => deviceData
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 42 })
      } as Response)

    const req: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const res = createMockRes()

    await checkHandler(req, res)

    // Main response should succeed
    expect(mockRes(res).status).toHaveBeenCalledWith(200)

    // Supabase should have been called
    expect(mockFetch).toHaveBeenCalledTimes(2)
    const supabaseCall = mockFetch.mock.calls[1]
    expect(String(supabaseCall[0])).toContain('imei_checks')
  })
})

// Helper to get typed mock response
function mockRes(res: MockResponse): MockResponse {
  return res
}

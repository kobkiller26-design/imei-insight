import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'

// Mock fetch globally
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
global.fetch = mockFetch

describe('Supabase Database Operations', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    mockFetch.mockClear()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('saves IMEI check result to Supabase when configured', async () => {
    process.env.IMEI_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'

    // First call = IMEI.org API, second call = Supabase
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ deviceModel: 'iPhone 12', brand: 'Apple' })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 })
      } as Response)

    const { default: handler } = await import('../../api/check.js') as {
      default: (req: MockRequest, res: MockResponse) => Promise<void>
    }

    const mockReq: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const mockRes: MockResponse = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => MockResponse>,
      json: jest.fn() as jest.MockedFunction<(data: unknown) => void>
    }

    await handler(mockReq, mockRes)

    // Should have made 2 fetch calls: IMEI API + Supabase
    expect(mockFetch).toHaveBeenCalledTimes(2)

    // Verify Supabase call
    const supabaseCall = mockFetch.mock.calls[1]
    expect(supabaseCall[0]).toContain('supabase.co')
    expect(supabaseCall[0]).toContain('imei_checks')
    expect(supabaseCall[1]).toMatchObject({
      method: 'POST',
      headers: expect.objectContaining({
        apikey: 'test-service-key'
      })
    })

    // Verify the saved data includes IMEI
    const savedBody = JSON.parse(supabaseCall[1]?.body as string)
    expect(savedBody.imei).toBe('359072157095826')
    expect(savedBody.result_json).toBeDefined()
    expect(savedBody.created_at).toBeDefined()
  })

  it('does not call Supabase when URL is not configured', async () => {
    process.env.IMEI_API_KEY = 'test-key'
    delete process.env.NEXT_PUBLIC_SUPABASE_URL

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deviceModel: 'Test Device' })
    } as Response)

    const { default: handler } = await import('../../api/check.js') as {
      default: (req: MockRequest, res: MockResponse) => Promise<void>
    }

    const mockReq: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const mockRes: MockResponse = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => MockResponse>,
      json: jest.fn() as jest.MockedFunction<(data: unknown) => void>
    }

    await handler(mockReq, mockRes)

    // Only 1 fetch call (IMEI API only, no Supabase)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('does not fail main response if Supabase save fails', async () => {
    process.env.IMEI_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'

    const mockDeviceData = { deviceModel: 'iPhone 12' }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeviceData
      } as Response)
      .mockRejectedValueOnce(new Error('Supabase connection failed'))

    const { default: handler } = await import('../../api/check.js') as {
      default: (req: MockRequest, res: MockResponse) => Promise<void>
    }

    const mockReq: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const mockRes: MockResponse = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => MockResponse>,
      json: jest.fn() as jest.MockedFunction<(data: unknown) => void>
    }

    await handler(mockReq, mockRes)

    // Should still return 200 success even if Supabase failed
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: mockDeviceData
    })
  })

  it('skips Supabase when URL is a placeholder value', async () => {
    process.env.IMEI_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://your-project.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deviceModel: 'Test Device' })
    } as Response)

    const { default: handler } = await import('../../api/check.js') as {
      default: (req: MockRequest, res: MockResponse) => Promise<void>
    }

    const mockReq: MockRequest = {
      method: 'POST',
      body: { imei: '359072157095826' }
    }
    const mockRes: MockResponse = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => MockResponse>,
      json: jest.fn() as jest.MockedFunction<(data: unknown) => void>
    }

    await handler(mockReq, mockRes)

    // Only 1 fetch call since placeholder URL is skipped
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})

interface MockRequest {
  method: string
  body: Record<string, unknown>
}

interface MockResponse {
  status: jest.MockedFunction<(code: number) => MockResponse>
  json: jest.MockedFunction<(data: unknown) => void>
}

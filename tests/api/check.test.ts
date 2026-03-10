/**
 * Tests for /api/check route
 *
 * Covers:
 *  1. Valid IMEI (15 digits)
 *  2. Invalid IMEI – wrong length
 *  3. Invalid IMEI – non-numeric
 *  4. Missing IMEI parameter
 *  5. Missing API key in env
 *  6. IMEI.org API failure (non-ok response)
 *  7. Network timeout / generic fetch error
 *  8. Successful response parsing
 */

import handler from '../../api/check.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockFetch = jest.fn()
;(global as any).fetch = mockFetch

function mockRes() {
  const res: any = {
    _status: 200,
    _headers: {} as Record<string, string>,
    _body: null as any,
    status(code: number) {
      this._status = code
      return this
    },
    json(data: any) {
      this._body = data
      return this
    },
    setHeader(key: string, value: string) {
      this._headers[key] = value
      return this
    },
    send(data: any) {
      this._body = data
      return this
    }
  }
  return res
}

function mockReq(overrides: any = {}) {
  return {
    method: 'POST',
    body: {},
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('POST /api/check', () => {
  const VALID_IMEI = '359072157095826'

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.IMEI_API_KEY = 'test-api-key-abc123'
    // Remove the fallback key so tests are isolated
    delete process.env.IMEI24_API_KEY
  })

  afterEach(() => {
    delete process.env.IMEI_API_KEY
  })

  // -------------------------------------------------------------------------
  // 1. Valid IMEI – happy path
  // -------------------------------------------------------------------------
  it('returns 200 and success:true for a valid 15-digit IMEI', async () => {
    const apiResponse = {
      deviceModel: 'iPhone 12 Pro',
      brand: 'Apple',
      imeiStatus: 'Valid',
      blacklistStatus: 'Clean',
      carrier: 'Verizon',
      country: 'United States'
    }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => apiResponse
    })

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(200)
    expect(res._body.success).toBe(true)
    expect(res._body.data).toEqual(apiResponse)
  })

  // -------------------------------------------------------------------------
  // 2. Invalid IMEI – wrong length (too short)
  // -------------------------------------------------------------------------
  it('returns 400 when IMEI has fewer than 15 digits', async () => {
    const req = mockReq({ body: { imei: '12345678901' } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(400)
    expect(res._body.error).toMatch(/Invalid IMEI/i)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns 400 when IMEI has more than 15 digits', async () => {
    const req = mockReq({ body: { imei: '1234567890123456' } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(400)
    expect(res._body.error).toMatch(/Invalid IMEI/i)
  })

  // -------------------------------------------------------------------------
  // 3. Invalid IMEI – non-numeric characters
  // -------------------------------------------------------------------------
  it('returns 400 when IMEI contains letters', async () => {
    const req = mockReq({ body: { imei: 'ABCDEFGHIJKLMNO' } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(400)
    expect(res._body.error).toMatch(/Invalid IMEI/i)
  })

  it('returns 400 when IMEI contains special characters', async () => {
    const req = mockReq({ body: { imei: '35907215-09582' } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(400)
    expect(res._body.error).toMatch(/Invalid IMEI/i)
  })

  // -------------------------------------------------------------------------
  // 4. Missing IMEI parameter
  // -------------------------------------------------------------------------
  it('returns 400 with "IMEI required" when body is empty', async () => {
    const req = mockReq({ body: {} })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(400)
    expect(res._body.error).toBe('IMEI required')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns 400 with "IMEI required" when imei is null', async () => {
    const req = mockReq({ body: { imei: null } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(400)
    expect(res._body.error).toBe('IMEI required')
  })

  // -------------------------------------------------------------------------
  // 5. Missing API key in environment
  // -------------------------------------------------------------------------
  it('returns 500 when IMEI_API_KEY is not set', async () => {
    delete process.env.IMEI_API_KEY
    delete process.env.IMEI24_API_KEY

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(500)
    expect(res._body.error).toMatch(/API key/i)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // 6. IMEI.org API failure (HTTP error response)
  // -------------------------------------------------------------------------
  it('returns 502 when IMEI.org API responds with a non-ok status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503
    })

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(502)
    expect(res._body.error).toMatch(/IMEI API/i)
  })

  it('returns 502 when IMEI.org API responds with 401 unauthorized', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(502)
  })

  // -------------------------------------------------------------------------
  // 7. Network timeout / fetch throws
  // -------------------------------------------------------------------------
  it('returns 504 when the request times out', async () => {
    const err: any = new Error('network timeout exceeded')
    err.name = 'TimeoutError'
    ;(err.message as string) = 'timeout'
    mockFetch.mockRejectedValueOnce(err)

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(504)
    expect(res._body.error).toMatch(/timed out/i)
  })

  it('returns 500 on a generic network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(500)
    expect(res._body.error).toMatch(/Server error/i)
  })

  // -------------------------------------------------------------------------
  // 8. Successful response parsing
  // -------------------------------------------------------------------------
  it('correctly returns all fields from the API response', async () => {
    const apiResponse = {
      deviceModel: 'Galaxy S21 Ultra',
      brand: 'Samsung',
      imeiStatus: 'Valid',
      blacklistStatus: 'Blacklisted',
      carrier: 'T-Mobile',
      country: 'Germany',
      purchaseDate: '2022-05-10',
      warrantyStatus: 'Expired'
    }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => apiResponse
    })

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(200)
    expect(res._body.data.brand).toBe('Samsung')
    expect(res._body.data.blacklistStatus).toBe('Blacklisted')
    expect(res._body.data.carrier).toBe('T-Mobile')
    expect(res._body.data.purchaseDate).toBe('2022-05-10')
  })

  it('sends the IMEI to IMEI.org with correct headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ brand: 'Apple' })
    })

    const req = mockReq({ body: { imei: VALID_IMEI } })
    const res = mockRes()
    await handler(req, res)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('https://api-client.imei.org/api/ihru')
    expect(options.method).toBe('POST')
    expect(options.headers['Authorization']).toBe('Bearer test-api-key-abc123')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ imei: VALID_IMEI })
  })

  // -------------------------------------------------------------------------
  // Extra: method guard
  // -------------------------------------------------------------------------
  it('returns 405 for GET requests', async () => {
    const req = mockReq({ method: 'GET' })
    const res = mockRes()
    await handler(req, res)

    expect(res._status).toBe(405)
    expect(res._body.error).toBe('Method not allowed')
  })
})

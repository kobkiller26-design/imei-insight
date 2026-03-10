import { jest } from '@jest/globals'

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})

// Silence console.error during tests unless explicitly needed
const originalConsoleError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('Error:'))
    ) {
      return
    }
    originalConsoleError(...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
})

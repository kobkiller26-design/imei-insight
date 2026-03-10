/**
 * Validates a 15-digit IMEI number using the Luhn algorithm.
 */
export function validateIMEI(imei: string): { valid: boolean; error?: string } {
  const cleaned = imei.replace(/\s+/g, '')

  if (!/^\d{15}$/.test(cleaned)) {
    return { valid: false, error: 'IMEI must be exactly 15 digits' }
  }

  // Luhn algorithm
  let sum = 0
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(cleaned[i], 10)
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }

  if (sum % 10 !== 0) {
    return { valid: false, error: 'Invalid IMEI number (checksum failed)' }
  }

  return { valid: true }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Calculate sell price with margin
 */
export function calculateSellPrice(apiPrice: number, marginPercent: number): number {
  return parseFloat((apiPrice + apiPrice * (marginPercent / 100)).toFixed(4))
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'badge-success'
    case 'pending':
      return 'badge-warning'
    case 'processing':
      return 'badge-info'
    case 'failed':
      return 'badge-error'
    default:
      return 'badge-info'
  }
}

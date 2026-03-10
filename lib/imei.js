/**
 * IMEI validation utilities
 */

/**
 * Check that the IMEI is exactly 15 digits
 * @param {string} imei
 * @returns {boolean}
 */
export function isValidFormat(imei) {
  return /^\d{15}$/.test(String(imei).trim())
}

/**
 * Validate IMEI using the Luhn algorithm
 * @param {string} imei
 * @returns {boolean}
 */
export function passesLuhn(imei) {
  const digits = String(imei).trim().split("").map(Number)
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i]
    if ((digits.length - 1 - i) % 2 === 1) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

/**
 * Fully validate an IMEI: format + Luhn check
 * @param {string} imei
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateIMEI(imei) {
  if (!imei) {
    return { valid: false, error: "IMEI is required" }
  }
  const cleaned = String(imei).replace(/\s/g, "")
  if (!isValidFormat(cleaned)) {
    return { valid: false, error: "IMEI must be exactly 15 digits" }
  }
  if (!passesLuhn(cleaned)) {
    return { valid: false, error: "IMEI failed Luhn check – please verify the number" }
  }
  return { valid: true }
}

/**
 * API tests using Node.js built-in test runner
 * Run with: npm test
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { validateIMEI, isValidFormat, passesLuhn } from "../lib/imei.js"

// --- IMEI validation tests ---

test("isValidFormat: accepts valid 15-digit IMEI", () => {
  assert.equal(isValidFormat("356938035643809"), true)
})

test("isValidFormat: rejects 14-digit string", () => {
  assert.equal(isValidFormat("35693803564380"), false)
})

test("isValidFormat: rejects 16-digit string", () => {
  assert.equal(isValidFormat("3569380356438090"), false)
})

test("isValidFormat: rejects non-numeric characters", () => {
  assert.equal(isValidFormat("35693803564380A"), false)
})

test("passesLuhn: accepts a known-good IMEI", () => {
  // 356938035643809 is a valid IMEI that passes Luhn
  assert.equal(passesLuhn("356938035643809"), true)
})

test("passesLuhn: rejects a known-bad IMEI", () => {
  // Modified last digit to break Luhn
  assert.equal(passesLuhn("356938035643800"), false)
})

test("validateIMEI: returns error for empty input", () => {
  const result = validateIMEI("")
  assert.equal(result.valid, false)
  assert.ok(result.error)
})

test("validateIMEI: returns error for non-15-digit input", () => {
  const result = validateIMEI("12345")
  assert.equal(result.valid, false)
  assert.match(result.error, /15 digits/)
})

test("validateIMEI: returns error for Luhn failure", () => {
  const result = validateIMEI("356938035643800")
  assert.equal(result.valid, false)
  assert.match(result.error, /Luhn/i)
})

test("validateIMEI: accepts valid IMEI", () => {
  const result = validateIMEI("356938035643809")
  assert.equal(result.valid, true)
  assert.equal(result.error, undefined)
})

test("validateIMEI: handles IMEI with surrounding whitespace", () => {
  const result = validateIMEI("  356938035643809  ")
  assert.equal(result.valid, true)
})

/**
 * Shared client-side field validators aligned with API Zod schemas.
 * Return an error message string, or undefined when valid.
 */

export const MOBILE_RE = /^[6-9]\d{9}$/
export const PAN_RE = /^[A-Z]{5}\d{4}[A-Z]$/

/** Local-part @ domain label pattern (no spaces, one @). */
const EMAIL_LOCAL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/
const EMAIL_LABEL_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/

/** Common gTLDs for simple domain.tld addresses. */
const KNOWN_GTLDS = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'info', 'biz', 'name', 'pro', 'museum', 'aero', 'coop', 'jobs', 'mobi', 'tel', 'travel',
  'asia', 'cat', 'post',
  'io', 'ai', 'app', 'dev', 'cloud', 'tech', 'online', 'store', 'site', 'shop', 'blog',
  'xyz', 'me', 'tv', 'cc', 'ws', 'co',
])

/**
 * Allowed second-level labels for country domains, e.g. company.co.in / org.ac.in.
 * This deliberately does NOT include "com", so typos like gmail.com.co are rejected.
 */
const COUNTRY_SECOND_LEVEL = new Set([
  'co', 'ac', 'gov', 'org', 'net', 'edu', 'gen', 'firm', 'ind', 'mil', 'sch', 'res',
])

export function trimValue(value) {
  return String(value ?? '').trim()
}

function isCountryTld(tld) {
  return /^[a-z]{2}$/.test(tld)
}

function isAllowedGtld(tld) {
  return KNOWN_GTLDS.has(tld) || isCountryTld(tld)
}

/**
 * Accepts:
 *   user@gmail.com
 *   hr@company.co.in
 * Rejects:
 *   user@gmail.com.co
 *   user@gmail.com.coin
 *   not-an-email
 */
function isValidEmailFormat(email) {
  if (!email || email.includes('..') || email.startsWith('.') || email.endsWith('.')) return false
  if ((email.match(/@/g) || []).length !== 1) return false

  const [local, domain] = email.split('@')
  if (!local || !domain) return false
  if (!EMAIL_LOCAL_RE.test(local) || local.startsWith('.') || local.endsWith('.')) return false

  const labels = domain.toLowerCase().split('.')
  if (labels.some((label) => !label || !EMAIL_LABEL_RE.test(label))) return false

  if (labels.length === 2) {
    const [name, tld] = labels
    return name.length >= 1 && isAllowedGtld(tld)
  }

  if (labels.length === 3) {
    const [name, second, tld] = labels
    return name.length >= 1 && COUNTRY_SECOND_LEVEL.has(second) && isCountryTld(tld)
  }

  return false
}

/** Keep digits only, optionally capped (e.g. mobile → 10). */
export function digitsOnly(value, maxLen) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return typeof maxLen === 'number' ? digits.slice(0, maxLen) : digits
}

export function required(value, message = 'This field is required.') {
  if (!trimValue(value)) return message
  return undefined
}

export function minLength(value, min, message) {
  const v = trimValue(value)
  if (!v) return undefined
  if (v.length < min) return message || `Must be at least ${min} characters.`
  return undefined
}

export function maxLength(value, max, message) {
  const v = trimValue(value)
  if (!v) return undefined
  if (v.length > max) return message || `Must be at most ${max} characters.`
  return undefined
}

/**
 * Email validation. Empty is only an error when required.
 * Enforces a real email shape: local@domain.tld (or local@domain.co.in style).
 */
export function validateEmail(value, { required: isRequired = true } = {}) {
  const v = trimValue(value)
  if (!v) return isRequired ? 'Email address is required.' : undefined
  if (!isValidEmailFormat(v)) return 'Enter a valid email address.'
  return undefined
}

/** Indian mobile: starts with 6–9, exactly 10 digits. */
export function validateMobile(value, { required: isRequired = true } = {}) {
  const v = trimValue(value)
  if (!v) return isRequired ? 'Mobile number is required.' : undefined
  if (!MOBILE_RE.test(v)) return 'Enter a valid 10-digit mobile number.'
  return undefined
}

/** PAN: ABCDE1234F (uppercase). */
export function validatePan(value, { required: isRequired = true } = {}) {
  const v = trimValue(value).toUpperCase()
  if (!v) return isRequired ? 'PAN number is required.' : undefined
  if (!PAN_RE.test(v)) return 'Enter a valid PAN, e.g. ABCDE1234F.'
  return undefined
}

export function validatePassword(value, { required: isRequired = true, min = 8 } = {}) {
  const v = String(value ?? '')
  if (!v) return isRequired ? 'Password is required.' : undefined
  if (v.length < min) return `Password must be at least ${min} characters.`
  return undefined
}

export function validatePasswordConfirm(password, confirm) {
  if (!String(confirm ?? '')) return 'Please confirm your password.'
  if (String(password ?? '') !== String(confirm ?? '')) return 'Passwords do not match.'
  return undefined
}

/** Login identifier: email or mobile (min 3 chars to match API). */
export function validateIdentifier(value) {
  const v = trimValue(value)
  if (!v) return 'Email or mobile number is required.'
  if (v.length < 3) return 'Enter a valid email or mobile number.'
  if (v.includes('@')) return validateEmail(v)
  if (/^\d+$/.test(v)) return validateMobile(v)
  return undefined
}

/** Collect only defined error messages into an errors object. */
export function collectErrors(entries) {
  const errors = {}
  for (const [field, message] of Object.entries(entries)) {
    if (message) errors[field] = message
  }
  return errors
}

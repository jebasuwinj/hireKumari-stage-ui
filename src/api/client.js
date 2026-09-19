// Thin fetch wrapper around the TN Job Portal API.
// Every call returns `{ data, message, meta }` on success and throws an
// ApiError (with `.code`, `.status`, `.details`) on failure, matching the
// API's { success, data, message, meta } / { success:false, message, code } envelope.

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://hirekumari-stage-api.onrender.com/api/v1').replace(/\/+$/, '')
const TOKEN_KEY = 'kkjp_token'

export class ApiError extends Error {
  constructor(message, { code, status, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Ignore storage failures (private browsing, blocked storage, ...).
  }
}

function buildUrl(path, query) {
  const url = new URL(BASE_URL + path)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

// De-duplicates identical in-flight GETs so several components mounting at
// once (e.g. everyone calling useCategories()) share a single network call.
const inFlightGets = new Map()

/**
 * @param {string} path e.g. '/jobs'
 * @param {object} [options]
 * @param {'GET'|'POST'|'PATCH'|'DELETE'} [options.method]
 * @param {object} [options.query] query params, falsy values are dropped
 * @param {object|FormData} [options.body]
 * @param {boolean} [options.raw] resolve to the raw Response instead of parsing JSON (for file downloads)
 */
export async function request(path, options = {}) {
  const { method = 'GET', query, body, raw = false } = options
  const url = buildUrl(path, query)
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData

  const dedupeKey = method === 'GET' ? url : null
  if (dedupeKey && inFlightGets.has(dedupeKey)) {
    return inFlightGets.get(dedupeKey)
  }

  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body && !isForm) headers['Content-Type'] = 'application/json'

  const promise = (async () => {
    let res
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      })
    } catch {
      throw new ApiError('Could not reach the server. Please check your connection and try again.', { status: 0 })
    }

    if (raw) {
      if (!res.ok) throw new ApiError('Request failed', { status: res.status })
      return res
    }

    if (res.status === 204) return { data: null, message: 'OK' }

    let json
    try {
      json = await res.json()
    } catch {
      throw new ApiError('Received an unexpected response from the server.', { status: res.status })
    }

    if (!res.ok || json.success === false) {
      throw new ApiError(json.message || 'Something went wrong', {
        code: json.code,
        status: res.status,
        details: json.details,
      })
    }

    return { data: json.data, message: json.message, meta: json.meta }
  })()

  if (dedupeKey) {
    inFlightGets.set(dedupeKey, promise)
    promise.finally(() => inFlightGets.delete(dedupeKey))
  }

  return promise
}

export const get = (path, query) => request(path, { method: 'GET', query })
export const post = (path, body) => request(path, { method: 'POST', body })
export const patch = (path, body) => request(path, { method: 'PATCH', body })
export const del = (path) => request(path, { method: 'DELETE' })

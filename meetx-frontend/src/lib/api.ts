export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

const ACCESS_TOKEN_KEY = 'meetx_access'
const PAI_TOKEN_KEY = 'meetx_pai'

function errorResponse(message: string, status = 503) {
  return new Response(
    JSON.stringify({
      ok: false,
      error: {
        code: 'NETWORK_ERROR',
        message
      }
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getPaiToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(PAI_TOKEN_KEY)
}

export function setPaiToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PAI_TOKEN_KEY, token)
}

export function clearPaiToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(PAI_TOKEN_KEY)
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })
    const json = await res.json()
    if (res.ok && json?.data?.tokens?.accessToken) {
      setAccessToken(json.data.tokens.accessToken)
      return true
    }
  } catch (err) {
    clearAccessToken()
  }
  clearAccessToken()
  return false
}

export async function apiFetch(path: string, init?: RequestInit, retry = true) {
  const headers = new Headers(init?.headers || {})
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include'
    })
  } catch (error) {
    return errorResponse('Unable to reach API server. Check NEXT_PUBLIC_API_URL and network access.')
  }

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiFetch(path, init, false)
    }
  }

  return response
}

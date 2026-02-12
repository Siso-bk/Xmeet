import type { Response } from 'express'

export const REFRESH_COOKIE = 'meetx_refresh'

export function setRefreshCookie(
  res: Response,
  token: string,
  ttlDays: number,
  options: { domain?: string; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none' }
) {
  const maxAge = ttlDays * 24 * 60 * 60 * 1000
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: options.sameSite ?? 'lax',
    secure: options.secure ?? false,
    domain: options.domain,
    maxAge
  })
}

export function clearRefreshCookie(
  res: Response,
  options: { domain?: string; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none' }
) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    sameSite: options.sameSite ?? 'lax',
    secure: options.secure ?? false,
    domain: options.domain
  })
}

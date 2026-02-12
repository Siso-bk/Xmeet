import { BadRequestException, Injectable, Logger, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'

export type PaiAuthUser = {
  id: string
  name?: string
  email: string
  createdAt?: string
  profileCompleted?: boolean
}

type PaiLoginResponse = { token: string; user: PaiAuthUser }
type PaiSignupResponse = { token: string; user: PaiAuthUser }

type PaiSignupRequestResponse = {
  exists?: boolean
  emailVerified?: boolean
  profileCompleted?: boolean
  message?: string
  devVerificationCode?: string
}

type PaiVerifyResponse = { preToken: string }

type PaiEventPayload = {
  source: string
  verb: string
  objectId?: string
  occurredAt?: string | number | Date
  props?: Record<string, unknown>
}

@Injectable()
export class PaiService {
  private readonly logger = new Logger(PaiService.name)

  constructor(private config: ConfigService, private usersService: UsersService) {}

  private get apiBase() {
    const raw = this.config.get<string>('pai.apiBase') || ''
    return raw.trim().replace(/\/+$/, '')
  }

  private get serviceKey() {
    const raw = this.config.get<string>('pai.serviceKey') || ''
    return raw.trim() || undefined
  }

  private get tenantId() {
    const raw = this.config.get<string>('pai.tenantId') || ''
    return raw.trim() || undefined
  }

  private get platform() {
    const raw = this.config.get<string>('pai.platform') || ''
    return raw.trim() || undefined
  }

  private buildUrl(path: string) {
    const base = this.apiBase
    if (!base) {
      throw new ServiceUnavailableException('PAI API base not configured')
    }
    const normalized = path.startsWith('/') ? path : `/${path}`
    return `${base}${normalized}`
  }

  private async requestJson<T>(path: string, init: RequestInit) {
    const url = this.buildUrl(path)
    const res = await fetch(url, init)
    const text = await res.text()
    let json: any = null
    if (text) {
      try {
        json = JSON.parse(text)
      } catch {
        json = { message: text }
      }
    }
    if (!res.ok) {
      const message = json?.error || json?.message || 'PAI request failed'
      if (res.status === 401 || res.status === 403) {
        throw new UnauthorizedException(message)
      }
      if (res.status >= 400 && res.status < 500) {
        throw new BadRequestException(message)
      }
      throw new ServiceUnavailableException(message)
    }
    return json as T
  }

  async requestSignupCode(email: string) {
    return this.requestJson<PaiSignupRequestResponse>('/api/auth/pai-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
  }

  async verifySignupCode(email: string, code: string) {
    return this.requestJson<PaiVerifyResponse>('/api/auth/pai-signup/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    })
  }

  async completeSignup(payload: { preToken: string; name: string; password: string; handle: string }) {
    return this.requestJson<PaiSignupResponse>('/api/auth/pai-signup/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  async login(payload: { email?: string; identifier?: string; password: string }) {
    return this.requestJson<PaiLoginResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  async logEvent(userId: string, payload: PaiEventPayload) {
    const base = this.apiBase
    const key = this.serviceKey
    if (!base || !key) return

    const user = await this.usersService.findById(userId)
    const externalId = user?.externalId
    if (!externalId) return

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-service-key': key,
      'x-user-id': externalId
    }

    if (this.tenantId) headers['x-tenant-id'] = this.tenantId
    if (this.platform) headers['x-platform'] = this.platform

    try {
      const res = await fetch(`${base}/api/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const text = await res.text()
        this.logger.warn(`PAI event failed (${res.status}): ${text}`)
      }
    } catch (err: any) {
      this.logger.warn(`PAI event error: ${err?.message || err}`)
    }
  }

  async createProfileMemory(paiToken: string, profile: {
    name: string
    headline?: string
    bio?: string
    skills?: string[]
    interests?: string[]
    goals?: string[]
    location?: string
    availability?: string
  }) {
    const base = this.apiBase
    if (!base || !paiToken) return

    const parts: string[] = []
    if (profile.headline) parts.push(`Headline: ${profile.headline}`)
    if (profile.bio) parts.push(`Bio: ${profile.bio}`)
    if (profile.skills?.length) parts.push(`Skills: ${profile.skills.join(', ')}`)
    if (profile.interests?.length) parts.push(`Interests: ${profile.interests.join(', ')}`)
    if (profile.goals?.length) parts.push(`Goals: ${profile.goals.join(', ')}`)
    if (profile.location) parts.push(`Location: ${profile.location}`)
    if (profile.availability) parts.push(`Availability: ${profile.availability}`)

    const summary = parts.length > 0 ? parts.join(' | ') : 'Profile updated.'
    const content = `MEETX profile for ${profile.name}. ${summary}`.slice(0, 1800)

    try {
      const res = await fetch(`${base}/api/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paiToken}`
        },
        body: JSON.stringify({
          kind: 'fact',
          content,
          source: 'meetx.profile',
          confidence: 0.9
        })
      })
      if (!res.ok) {
        const text = await res.text()
        this.logger.warn(`PAI memory failed (${res.status}): ${text}`)
      }
    } catch (err: any) {
      this.logger.warn(`PAI memory error: ${err?.message || err}`)
    }
  }
}

import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UsersService } from '../users/users.service'
import { SessionsService } from '../sessions/sessions.service'
import { comparePassword, randomToken, hashToken, generateNumericCode } from '../../common/utils/security'
import type { UserPublic } from '@meetx/shared'
import { PasswordResetToken, PasswordResetTokenDocument } from './schemas/password-reset.schema'
import { PersonalAiCode, PersonalAiCodeDocument } from './schemas/personalai-code.schema'
import { PaiService, type PaiAuthUser } from '../pai/pai.service'

@Injectable()
export class AuthService {
  private refreshTtlDays: number
  private resetTtlMinutes: number
  private personalAiTtlMinutes: number
  public cookieDomain?: string
  public cookieSecure: boolean
  public cookieSameSite: 'lax' | 'strict' | 'none'

  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private paiService: PaiService,
    @InjectModel(PasswordResetToken.name) private resetModel: Model<PasswordResetTokenDocument>,
    @InjectModel(PersonalAiCode.name) private personalAiModel: Model<PersonalAiCodeDocument>
  ) {
    this.refreshTtlDays = this.configService.get<number>('refresh.ttlDays') || 7
    this.resetTtlMinutes = this.configService.get<number>('passwordReset.ttlMinutes') || 30
    this.personalAiTtlMinutes = this.configService.get<number>('personalAi.ttlMinutes') || 10
    this.cookieDomain = this.configService.get<string>('cookie.domain')
    this.cookieSecure = this.configService.get<boolean>('cookie.secure') || false
    this.cookieSameSite = (this.configService.get<string>('cookie.sameSite') as 'lax' | 'strict' | 'none') || 'lax'
  }

  getRefreshTtlDays() {
    return this.refreshTtlDays
  }

  async register(dto: { email: string; password: string; name: string }) {
    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) {
      throw new ConflictException('Email already registered')
    }
    const user = await this.usersService.createLocalUser(dto)
    return this.toUserPublic(user)
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const valid = await comparePassword(dto.password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const access = await this.issueAccessToken(user)
    const refreshToken = randomToken()
    await this.sessionsService.createSession(user.id, refreshToken, this.refreshTtlDays)
    return { user: this.toUserPublic(user), tokens: access, refreshToken }
  }

  async loginWithPai(dto: { email?: string; identifier?: string; password: string }) {
    const response = await this.paiService.login(dto)
    const user = await this.syncPaiUser(response.user)
    const access = await this.issueAccessToken(user)
    const refreshToken = randomToken()
    await this.sessionsService.createSession(user.id, refreshToken, this.refreshTtlDays)
    return { user: this.toUserPublic(user), tokens: access, refreshToken, paiToken: response.token }
  }

  async requestPaiSignupCode(email: string) {
    return this.paiService.requestSignupCode(email)
  }

  async verifyPaiSignupCode(email: string, code: string) {
    return this.paiService.verifySignupCode(email, code)
  }

  async completePaiSignup(dto: { preToken: string; name: string; password: string; handle: string }) {
    const response = await this.paiService.completeSignup(dto)
    const user = await this.syncPaiUser(response.user)
    const access = await this.issueAccessToken(user)
    const refreshToken = randomToken()
    await this.sessionsService.createSession(user.id, refreshToken, this.refreshTtlDays)
    return { user: this.toUserPublic(user), tokens: access, refreshToken, paiToken: response.token }
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token')
    }
    const session = await this.sessionsService.findValidSessionByToken(refreshToken)
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token')
    }
    const user = await this.usersService.findById(String(session.userId))
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    await this.sessionsService.revokeSessionById(String(session.id), 'rotated')
    const newRefresh = randomToken()
    await this.sessionsService.createSession(user.id, newRefresh, this.refreshTtlDays)
    const access = await this.issueAccessToken(user)

    return { access, refreshToken: newRefresh }
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return
    await this.sessionsService.revokeByToken(refreshToken)
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user || user.authProvider !== 'local') {
      return { resetToken: undefined }
    }

    await this.resetModel
      .updateMany({ userId: user.id, usedAt: { $exists: false } }, { $set: { usedAt: new Date() } })
      .exec()

    const rawToken = randomToken()
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + this.resetTtlMinutes * 60 * 1000)
    await this.resetModel.create({ userId: user.id, tokenHash, expiresAt })

    if (this.configService.get<string>('env') !== 'production') {
      return { resetToken: rawToken }
    }

    return { resetToken: undefined }
  }

  async resetPassword(token: string, password: string) {
    if (!token) {
      throw new BadRequestException('Missing reset token')
    }

    const tokenHash = hashToken(token)
    const reset = await this.resetModel
      .findOne({ tokenHash, usedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
      .exec()

    if (!reset) {
      throw new UnauthorizedException('Invalid or expired reset token')
    }

    const user = await this.usersService.findById(String(reset.userId))
    if (!user || user.authProvider !== 'local') {
      throw new UnauthorizedException('Invalid user')
    }

    await this.usersService.setPassword(user.id, password)
    await this.resetModel.updateOne({ _id: reset.id }, { $set: { usedAt: new Date() } }).exec()
    await this.sessionsService.revokeAllForUser(user.id, 'password_reset')

    return { status: 'ok' }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId)
    if (!user || !user.passwordHash || user.authProvider !== 'local') {
      throw new UnauthorizedException('Invalid user')
    }

    const valid = await comparePassword(currentPassword, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    await this.usersService.setPassword(user.id, newPassword)
    await this.sessionsService.revokeAllForUser(user.id, 'password_change')

    return { status: 'ok' }
  }

  async requestPersonalAiCode(email: string) {
    const normalized = email.toLowerCase()
    const code = generateNumericCode(6)
    const codeHash = hashToken(code)
    const expiresAt = new Date(Date.now() + this.personalAiTtlMinutes * 60 * 1000)

    await this.personalAiModel
      .updateMany({ email: normalized, usedAt: { $exists: false } }, { $set: { usedAt: new Date() } })
      .exec()

    await this.personalAiModel.create({ email: normalized, codeHash, expiresAt })

    const serviceUrl = this.configService.get<string>('personalAi.serviceUrl')
    const apiKey = this.configService.get<string>('personalAi.apiKey')

    if (!serviceUrl) {
      if (this.configService.get<string>('env') === 'production') {
        throw new ServiceUnavailableException('Personal AI service not configured')
      }
      return { code }
    }

    const response = await fetch(`${serviceUrl}/personal-ai/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({ email: normalized, code, ttlMinutes: this.personalAiTtlMinutes, purpose: 'auth' })
    })

    if (!response.ok) {
      throw new ServiceUnavailableException('Personal AI service failed to deliver code')
    }

    if (this.configService.get<string>('env') !== 'production') {
      return { code }
    }

    return { code: undefined }
  }

  async verifyPersonalAiCode(email: string, code: string, name?: string) {
    const normalized = email.toLowerCase()
    const codeHash = hashToken(code)

    const record = await this.personalAiModel
      .findOne({ email: normalized, codeHash, usedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
      .exec()

    if (!record) {
      throw new UnauthorizedException('Invalid or expired code')
    }

    await this.personalAiModel.updateOne({ _id: record.id }, { $set: { usedAt: new Date() } }).exec()

    let user = await this.usersService.findByEmail(normalized)
    if (!user) {
      user = await this.usersService.createPersonalAiUser({
        email: normalized,
        name
      })
    }

    const access = await this.issueAccessToken(user)
    const refreshToken = randomToken()
    await this.sessionsService.createSession(user.id, refreshToken, this.refreshTtlDays)

    return { user: this.toUserPublic(user), tokens: access, refreshToken }
  }

  private async issueAccessToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await this.jwtService.signAsync(payload)
    const expiresIn = this.configService.get<number>('jwt.accessTtl') || 900
    return { accessToken, expiresIn }
  }

  private async syncPaiUser(paiUser: PaiAuthUser) {
    const email = paiUser.email.toLowerCase()
    let user = await this.usersService.findByEmail(email)

    if (!user) {
      user = await this.usersService.createPersonalAiUser({
        email,
        name: paiUser.name,
        externalId: paiUser.id
      })
      return user
    }

    const updates: Record<string, any> = {}
    if (!user.externalId && paiUser.id) {
      updates.externalId = paiUser.id
    }
    if (paiUser.name && user.name !== paiUser.name) {
      updates.name = paiUser.name
    }
    if (user.authProvider !== 'personalai') {
      updates.authProvider = 'personalai'
    }

    if (Object.keys(updates).length > 0) {
      const updated = await this.usersService.updateById(user.id, updates)
      if (updated) {
        user = updated
      }
    }

    return user
  }

  private toUserPublic(user: any): UserPublic {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
      createdAt: user.createdAt
    }
  }
}

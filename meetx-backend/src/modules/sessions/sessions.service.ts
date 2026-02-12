import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Session, SessionDocument } from './schemas/session.schema'
import { hashToken } from '../../common/utils/security'

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  async createSession(userId: string, token: string, ttlDays: number) {
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000)
    return this.sessionModel.create({ userId, tokenHash, expiresAt })
  }

  async findValidSessionByToken(token: string) {
    const tokenHash = hashToken(token)
    return this.sessionModel
      .findOne({
        tokenHash,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() }
      })
      .exec()
  }

  async revokeByToken(token: string) {
    const tokenHash = hashToken(token)
    return this.sessionModel.updateOne({ tokenHash }, { $set: { revokedAt: new Date() } }).exec()
  }

  async revokeSessionById(id: string, reason?: string) {
    return this.sessionModel.updateOne({ _id: id }, { $set: { revokedAt: new Date(), reason } }).exec()
  }

  async revokeAllForUser(userId: string, reason?: string) {
    return this.sessionModel.updateMany({ userId }, { $set: { revokedAt: new Date(), reason } }).exec()
  }
}

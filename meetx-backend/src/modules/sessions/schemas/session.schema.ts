import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type SessionDocument = HydratedDocument<Session>

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId!: Types.ObjectId

  @Prop({ required: true })
  tokenHash!: string

  @Prop({ required: true })
  expiresAt!: Date

  @Prop()
  revokedAt?: Date

  @Prop()
  revokedReason?: string
}

export const SessionSchema = SchemaFactory.createForClass(Session)
SessionSchema.index({ tokenHash: 1 }, { unique: true })
SessionSchema.index({ userId: 1, createdAt: -1 })
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
SessionSchema.set('toJSON', { virtuals: true })
SessionSchema.set('toObject', { virtuals: true })

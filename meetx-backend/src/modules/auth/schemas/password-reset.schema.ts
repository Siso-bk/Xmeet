import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type PasswordResetTokenDocument = HydratedDocument<PasswordResetToken>

@Schema({ timestamps: true })
export class PasswordResetToken {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId!: Types.ObjectId

  @Prop({ required: true })
  tokenHash!: string

  @Prop({ required: true })
  expiresAt!: Date

  @Prop()
  usedAt?: Date
}

export const PasswordResetTokenSchema = SchemaFactory.createForClass(PasswordResetToken)
PasswordResetTokenSchema.index({ tokenHash: 1 }, { unique: true })
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
PasswordResetTokenSchema.set('toJSON', { virtuals: true })
PasswordResetTokenSchema.set('toObject', { virtuals: true })

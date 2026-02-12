import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type PersonalAiCodeDocument = HydratedDocument<PersonalAiCode>

@Schema({ timestamps: true })
export class PersonalAiCode {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId?: Types.ObjectId

  @Prop({ required: true })
  email!: string

  @Prop({ required: true })
  codeHash!: string

  @Prop({ required: true })
  expiresAt!: Date

  @Prop()
  usedAt?: Date
}

export const PersonalAiCodeSchema = SchemaFactory.createForClass(PersonalAiCode)
PersonalAiCodeSchema.index({ codeHash: 1 }, { unique: true })
PersonalAiCodeSchema.index({ email: 1, createdAt: -1 })
PersonalAiCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
PersonalAiCodeSchema.set('toJSON', { virtuals: true })
PersonalAiCodeSchema.set('toObject', { virtuals: true })

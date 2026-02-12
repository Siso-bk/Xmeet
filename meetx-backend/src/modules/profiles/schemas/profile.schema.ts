import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import type { ProfileVisibility } from '@meetx/shared'

export type ProfileDocument = HydratedDocument<Profile>

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true, unique: true })
  userId!: string

  @Prop({ required: true })
  name!: string

  @Prop()
  headline?: string

  @Prop()
  bio?: string

  @Prop({ type: [String], default: [] })
  skills!: string[]

  @Prop({ type: [String], default: [] })
  interests!: string[]

  @Prop({ type: [String], default: [] })
  goals!: string[]

  @Prop()
  location?: string

  @Prop()
  availability?: string

  @Prop({ default: 'public' })
  visibility!: ProfileVisibility

  @Prop()
  updatedAt?: Date
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)
ProfileSchema.index({ userId: 1 }, { unique: true })
ProfileSchema.set('toJSON', { virtuals: true })
ProfileSchema.set('toObject', { virtuals: true })

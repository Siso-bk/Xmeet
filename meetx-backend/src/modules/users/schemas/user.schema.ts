import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import type { AuthProvider, Role } from '@meetx/shared'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string

  @Prop()
  passwordHash?: string

  @Prop({ required: true })
  name!: string

  @Prop({ default: 'user' })
  role!: Role

  @Prop({ default: 'local' })
  authProvider!: AuthProvider

  @Prop()
  externalId?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.set('toJSON', { virtuals: true })
UserSchema.set('toObject', { virtuals: true })

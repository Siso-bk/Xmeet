import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MessageDocument = HydratedDocument<Message>

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  matchId!: string

  @Prop({ required: true })
  senderId!: string

  @Prop({ required: true })
  content!: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)
MessageSchema.index({ matchId: 1, createdAt: 1 })
MessageSchema.set('toJSON', { virtuals: true })
MessageSchema.set('toObject', { virtuals: true })

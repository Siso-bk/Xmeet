import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import type { SwipeAction } from '@meetx/shared'

export type SwipeDocument = HydratedDocument<Swipe>

@Schema({ timestamps: true })
export class Swipe {
  @Prop({ required: true })
  fromUserId!: string

  @Prop({ required: true })
  toUserId!: string

  @Prop({ required: true })
  action!: SwipeAction
}

export const SwipeSchema = SchemaFactory.createForClass(Swipe)
SwipeSchema.index({ fromUserId: 1, createdAt: -1 })
SwipeSchema.index({ toUserId: 1, createdAt: -1 })
SwipeSchema.set('toJSON', { virtuals: true })
SwipeSchema.set('toObject', { virtuals: true })

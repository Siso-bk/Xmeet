import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MatchDocument = HydratedDocument<Match>

@Schema({ timestamps: true })
export class Match {
  @Prop({ type: [String], required: true })
  userIds!: string[]

  @Prop()
  lastMessageAt?: Date
}

export const MatchSchema = SchemaFactory.createForClass(Match)
MatchSchema.index({ userIds: 1 })
MatchSchema.set('toJSON', { virtuals: true })
MatchSchema.set('toObject', { virtuals: true })

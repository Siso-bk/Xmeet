import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Match, MatchDocument } from './schemas/match.schema'

@Injectable()
export class MatchesService {
  constructor(@InjectModel(Match.name) private matchModel: Model<MatchDocument>) {}

  async list(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize
    const [items, total] = await Promise.all([
      this.matchModel.find({ userIds: userId }).sort({ lastMessageAt: -1 }).skip(skip).limit(pageSize).exec(),
      this.matchModel.countDocuments({ userIds: userId })
    ])

    return { items, total, page, pageSize }
  }
}

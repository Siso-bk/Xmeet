import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema'
import { PaiService } from '../pai/pai.service'

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private paiService: PaiService
  ) {}

  async list(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize
    const [items, total] = await Promise.all([
      this.profileModel.find({ userId: { $ne: userId } }).skip(skip).limit(pageSize).exec(),
      this.profileModel.countDocuments({ userId: { $ne: userId } })
    ])

    void this.paiService.logEvent(userId, {
      source: 'meetx.feed',
      verb: 'view',
      props: { page, pageSize, total }
    })

    return {
      items,
      total,
      page,
      pageSize
    }
  }
}

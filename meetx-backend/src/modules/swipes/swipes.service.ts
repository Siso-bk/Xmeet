import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Swipe, SwipeDocument } from './schemas/swipe.schema'
import { Match, MatchDocument } from '../matches/schemas/match.schema'
import { PaiService } from '../pai/pai.service'

@Injectable()
export class SwipesService {
  constructor(
    @InjectModel(Swipe.name) private swipeModel: Model<SwipeDocument>,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private paiService: PaiService
  ) {}

  async swipe(fromUserId: string, dto: { toUserId: string; action: 'like' | 'skip' }) {
    const swipe = await this.swipeModel.create({
      fromUserId,
      toUserId: dto.toUserId,
      action: dto.action
    })

    void this.paiService.logEvent(fromUserId, {
      source: 'meetx.swipe',
      verb: dto.action,
      objectId: dto.toUserId
    })

    if (dto.action === 'like') {
      const reciprocal = await this.swipeModel.findOne({
        fromUserId: dto.toUserId,
        toUserId: fromUserId,
        action: 'like'
      })

      if (reciprocal) {
        const existing = await this.matchModel.findOne({ userIds: { $all: [fromUserId, dto.toUserId] } })
        if (!existing) {
          const match = await this.matchModel.create({ userIds: [fromUserId, dto.toUserId] })
          void this.paiService.logEvent(fromUserId, {
            source: 'meetx.match',
            verb: 'created',
            objectId: match.id,
            props: { withUserId: dto.toUserId }
          })
          void this.paiService.logEvent(dto.toUserId, {
            source: 'meetx.match',
            verb: 'created',
            objectId: match.id,
            props: { withUserId: fromUserId }
          })
        }
      }
    }

    return { swipe }
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message, MessageDocument } from './schemas/message.schema'
import { Match, MatchDocument } from '../matches/schemas/match.schema'
import { PaiService } from '../pai/pai.service'

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private paiService: PaiService
  ) {}

  async list(userId: string, matchId: string) {
    const match = await this.matchModel.findById(matchId)
    if (!match || !match.userIds.includes(userId)) {
      throw new ForbiddenException('Not a match member')
    }

    const items = await this.messageModel.find({ matchId }).sort({ createdAt: 1 }).exec()
    return { items, total: items.length, page: 1, pageSize: items.length }
  }

  async send(userId: string, dto: { matchId: string; content: string }) {
    const match = await this.matchModel.findById(dto.matchId)
    if (!match || !match.userIds.includes(userId)) {
      throw new ForbiddenException('Not a match member')
    }

    const message = await this.messageModel.create({
      matchId: dto.matchId,
      senderId: userId,
      content: dto.content
    })

    await this.matchModel.updateOne({ _id: dto.matchId }, { $set: { lastMessageAt: new Date() } })

    void this.paiService.logEvent(userId, {
      source: 'meetx.message',
      verb: 'sent',
      objectId: message.id,
      props: { matchId: dto.matchId, length: dto.content.length }
    })

    return { message }
  }
}

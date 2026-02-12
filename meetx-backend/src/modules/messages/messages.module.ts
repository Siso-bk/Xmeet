import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { Message, MessageSchema } from './schemas/message.schema'
import { Match, MatchSchema } from '../matches/schemas/match.schema'
import { PaiModule } from '../pai/pai.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Match.name, schema: MatchSchema }
    ]),
    PaiModule
  ],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}

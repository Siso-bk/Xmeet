import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { MessagesService } from './messages.service'
import { SendMessageDto } from '@meetx/shared'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(':matchId')
  @UseGuards(JwtAuthGuard)
  async list(@CurrentUser() user: any, @Param('matchId') matchId: string) {
    return this.messagesService.list(user.id, matchId)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(SendMessageDto))
  async send(@CurrentUser() user: any, @Body() body: any) {
    return this.messagesService.send(user.id, body)
  }
}

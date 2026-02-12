import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { FeedService } from './feed.service'

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@CurrentUser() user: any, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    const p = Math.max(1, parseInt(page || '1', 10))
    const ps = Math.min(50, Math.max(1, parseInt(pageSize || '20', 10)))
    return this.feedService.list(user.id, p, ps)
  }
}

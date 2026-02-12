import { Body, Controller, Get, Put, Req, UseGuards, UsePipes } from '@nestjs/common'
import type { Request } from 'express'
import { UpsertProfileDto } from '@meetx/shared'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { ProfilesService } from './profiles.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMine(@CurrentUser() user: any) {
    const profile = await this.profilesService.getByUserId(user.id)
    return { profile }
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(UpsertProfileDto))
  async upsert(@CurrentUser() user: any, @Body() body: any, @Req() req: Request) {
    const header = req.headers['x-pai-token']
    const paiToken = typeof header === 'string' ? header : Array.isArray(header) ? header[0] : undefined
    const profile = await this.profilesService.upsert(user.id, body, paiToken)
    return { profile }
  }
}

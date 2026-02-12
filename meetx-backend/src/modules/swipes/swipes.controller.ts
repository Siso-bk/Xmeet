import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { SwipeDto } from '@meetx/shared'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { SwipesService } from './swipes.service'

@Controller('swipes')
export class SwipesController {
  constructor(private swipesService: SwipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(SwipeDto))
  async swipe(@CurrentUser() user: any, @Body() body: any) {
    return this.swipesService.swipe(user.id, body)
  }
}

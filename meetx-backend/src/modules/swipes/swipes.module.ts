import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SwipesController } from './swipes.controller'
import { SwipesService } from './swipes.service'
import { Swipe, SwipeSchema } from './schemas/swipe.schema'
import { Match, MatchSchema } from '../matches/schemas/match.schema'
import { PaiModule } from '../pai/pai.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Swipe.name, schema: SwipeSchema },
      { name: Match.name, schema: MatchSchema }
    ]),
    PaiModule
  ],
  controllers: [SwipesController],
  providers: [SwipesService]
})
export class SwipesModule {}

import { Module } from '@nestjs/common'
import { FeedController } from './feed.controller'
import { FeedService } from './feed.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Profile, ProfileSchema } from '../profiles/schemas/profile.schema'
import { PaiModule } from '../pai/pai.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]), PaiModule],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}

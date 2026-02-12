import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProfilesService } from './profiles.service'
import { ProfilesController } from './profiles.controller'
import { Profile, ProfileSchema } from './schemas/profile.schema'
import { PaiModule } from '../pai/pai.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]), PaiModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService]
})
export class ProfilesModule {}

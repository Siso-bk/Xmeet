import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from '../users/users.module'
import { PaiService } from './pai.service'

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [PaiService],
  exports: [PaiService]
})
export class PaiModule {}

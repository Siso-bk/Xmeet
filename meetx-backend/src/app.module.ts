import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import configuration from './config/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { SessionsModule } from './modules/sessions/sessions.module'
import { ProfilesModule } from './modules/profiles/profiles.module'
import { FeedModule } from './modules/feed/feed.module'
import { SwipesModule } from './modules/swipes/swipes.module'
import { MatchesModule } from './modules/matches/matches.module'
import { MessagesModule } from './modules/messages/messages.module'
import { UploadsModule } from './modules/uploads/uploads.module'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUri')
      })
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100
        }
      ]
    }),
    AuthModule,
    UsersModule,
    SessionsModule,
    ProfilesModule,
    FeedModule,
    SwipesModule,
    MatchesModule,
    MessagesModule,
    UploadsModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}

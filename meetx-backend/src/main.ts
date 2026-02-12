import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { ConfigService } from '@nestjs/config'
import { Logger, LogLevel } from '@nestjs/common'

const LOG_LEVELS: Record<string, LogLevel[]> = {
  debug: ['debug', 'log', 'warn', 'error', 'verbose'],
  info: ['log', 'warn', 'error'],
  warn: ['warn', 'error'],
  error: ['error']
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)
  const logger = new Logger('Bootstrap')

  const logLevel = config.get<string>('logLevel') || 'info'
  app.useLogger(LOG_LEVELS[logLevel] || LOG_LEVELS.info)

  app.set('trust proxy', 1)
  app.enableShutdownHooks()

  app.use(helmet())
  app.use(cookieParser())

  const corsOrigin = config.get<string>('corsOrigin') || ''
  const origins = corsOrigin
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  app.enableCors({
    origin: origins.length > 0 ? origins : true,
    credentials: true
  })

  app.setGlobalPrefix('api')
  app.useGlobalInterceptors(new LoggingInterceptor(), new ApiResponseInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())

  if (config.get<boolean>('swaggerEnabled')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('MEETX API')
      .setDescription('MEETX backend API')
      .setVersion('v1')
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document)
  }

  const port = config.get<number>('port') || 4000
  await app.listen(port)
  logger.log(`MEETX API listening on ${port}`)
}

bootstrap()

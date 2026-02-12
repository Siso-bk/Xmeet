import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    const url = request.originalUrl || request.url
    const start = Date.now()

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse()
          const duration = Date.now() - start
          this.logger.log(`${method} ${url} ${response.statusCode} ${duration}ms`)
        },
        error: (err) => {
          const response = context.switchToHttp().getResponse()
          const duration = Date.now() - start
          this.logger.error(`${method} ${url} ${response?.statusCode || 500} ${duration}ms`, err?.stack)
        }
      })
    )
  }
}

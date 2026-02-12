import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let code = 'INTERNAL_ERROR'
    let message = 'Internal server error'
    let details: Record<string, unknown> | undefined

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const payload = exception.getResponse()

      if (typeof payload === 'string') {
        message = payload
      } else if (typeof payload === 'object' && payload) {
        const data = payload as Record<string, unknown>
        message = (data.message as string) || message
        code = (data.code as string) || code
        if (data.details) {
          details = data.details as Record<string, unknown>
        }
      }
    }

    response.status(status).json({
      ok: false,
      error: {
        code,
        message,
        details: {
          ...details,
          status,
          path: request.url,
          timestamp: new Date().toISOString()
        }
      }
    })
  }
}

import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { UploadsService } from './uploads.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'

const UploadRequest = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1)
})

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('sign')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(UploadRequest))
  async sign(@Body() body: any) {
    return this.uploadsService.createSignedUploadUrl(body.fileName, body.contentType)
  }
}

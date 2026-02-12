import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Storage } from '@google-cloud/storage'

@Injectable()
export class UploadsService {
  private storage: Storage
  private bucketName: string

  constructor(private configService: ConfigService) {
    this.storage = new Storage({ projectId: this.configService.get<string>('gcs.projectId') })
    this.bucketName = this.configService.get<string>('gcs.bucket') || ''
  }

  async createSignedUploadUrl(fileName: string, contentType: string) {
    if (!this.bucketName) {
      return { url: '', message: 'GCS bucket not configured' }
    }

    const bucket = this.storage.bucket(this.bucketName)
    const file = bucket.file(fileName)
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType
    })

    return { url, method: 'PUT', contentType }
  }
}

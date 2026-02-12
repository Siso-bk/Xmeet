import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { hashPassword } from '../../common/utils/security'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createLocalUser(dto: { email: string; password: string; name: string }) {
    const passwordHash = await hashPassword(dto.password)
    const user = new this.userModel({
      email: dto.email.toLowerCase(),
      passwordHash,
      name: dto.name,
      role: 'user',
      authProvider: 'local'
    })
    return user.save()
  }

  async createPersonalAiUser(dto: { email: string; name?: string; externalId?: string }) {
    const user = new this.userModel({
      email: dto.email.toLowerCase(),
      name: dto.name || dto.email.split('@')[0],
      role: 'user',
      authProvider: 'personalai',
      externalId: dto.externalId
    })
    return user.save()
  }

  async updateById(userId: string, updates: Partial<User>) {
    return this.userModel.findByIdAndUpdate(userId, updates, { new: true }).exec()
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec()
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec()
  }

  async setPassword(userId: string, password: string) {
    const passwordHash = await hashPassword(password)
    return this.userModel.updateOne({ _id: userId }, { $set: { passwordHash } }).exec()
  }
}

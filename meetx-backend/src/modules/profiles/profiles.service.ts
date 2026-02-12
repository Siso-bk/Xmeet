import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Profile, ProfileDocument } from './schemas/profile.schema'
import { PaiService } from '../pai/pai.service'

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private paiService: PaiService
  ) {}

  async getByUserId(userId: string) {
    return this.profileModel.findOne({ userId }).exec()
  }

  async upsert(userId: string, dto: any, paiToken?: string) {
    const profile = await this.profileModel.findOneAndUpdate(
      { userId },
      { ...dto, userId, updatedAt: new Date() },
      { new: true, upsert: true }
    )

    void this.paiService.logEvent(userId, {
      source: 'meetx.profile',
      verb: 'updated',
      objectId: userId,
      props: { visibility: profile.visibility }
    })

    if (paiToken) {
      void this.paiService.createProfileMemory(paiToken, {
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills,
        interests: profile.interests,
        goals: profile.goals,
        location: profile.location,
        availability: profile.availability
      })
    }

    return profile
  }
}

import type { ApiResponse } from '../../types/common'
import type { Profile } from '../../types/profile'

export type UpsertProfileRequest = Omit<Profile, 'userId' | 'updatedAt'>

export type UpsertProfileResponse = ApiResponse<{ profile: Profile }>

export type GetProfileResponse = ApiResponse<{ profile: Profile | null }>

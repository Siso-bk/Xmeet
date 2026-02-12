import type { ApiResponse, Paginated } from '../../types/common'
import type { Profile } from '../../types/profile'

export type FeedResponse = ApiResponse<Paginated<Profile>>

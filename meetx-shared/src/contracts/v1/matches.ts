import type { ApiResponse, Paginated } from '../../types/common'
import type { MatchSummary } from '../../types/matching'

export type MatchesResponse = ApiResponse<Paginated<MatchSummary>>

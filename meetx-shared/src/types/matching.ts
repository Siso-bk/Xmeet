export type SwipeAction = 'like' | 'skip'

export type MatchSummary = {
  id: string
  userIds: string[]
  createdAt: string
  lastMessageAt?: string
}

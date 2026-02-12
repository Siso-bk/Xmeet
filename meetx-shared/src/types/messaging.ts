export type Message = {
  id: string
  matchId: string
  senderId: string
  content: string
  createdAt: string
}

export type SendMessagePayload = {
  matchId: string
  content: string
}

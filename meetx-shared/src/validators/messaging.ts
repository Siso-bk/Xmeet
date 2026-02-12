import { z } from 'zod'

export const SendMessageDto = z.object({
  matchId: z.string().min(1),
  content: z.string().min(1).max(2000)
})

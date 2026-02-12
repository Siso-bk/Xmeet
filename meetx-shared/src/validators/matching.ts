import { z } from 'zod'

export const SwipeDto = z.object({
  toUserId: z.string().min(1),
  action: z.enum(['like', 'skip'])
})

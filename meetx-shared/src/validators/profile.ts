import { z } from 'zod'

export const UpsertProfileDto = z.object({
  name: z.string().min(1),
  headline: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  location: z.string().optional(),
  availability: z.string().optional(),
  visibility: z.enum(['public', 'private', 'org']).default('public')
})

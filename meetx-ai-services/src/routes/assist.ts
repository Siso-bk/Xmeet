import { Router } from 'express'
import { z } from 'zod'
import { generateSuggestion } from '../services/ai'

export const assistRouter = Router()

const AssistRequest = z.object({
  type: z.enum(['bio', 'message', 'summary']),
  input: z.string().min(1)
})

assistRouter.post('/', async (req, res) => {
  const parsed = AssistRequest.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  }

  const suggestion = await generateSuggestion(parsed.data.type, parsed.data.input)
  return res.json({ ok: true, data: { suggestion } })
})

import { Router } from 'express'
import { z } from 'zod'
import { sendPersonalAiCode } from '../services/personalAi'

export const personalAiRouter = Router()

const SendCodeRequest = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  ttlMinutes: z.number().int().positive().optional(),
  purpose: z.string().optional()
})

personalAiRouter.post('/send-code', async (req, res) => {
  const apiKey = process.env.PERSONALAI_API_KEY
  if (apiKey) {
    const header = req.headers['authorization'] || ''
    const token = typeof header === 'string' ? header.replace('Bearer ', '') : ''
    const altKey = req.headers['x-api-key']
    const provided = token || (Array.isArray(altKey) ? altKey[0] : altKey)
    if (provided !== apiKey) {
      return res.status(401).json({ ok: false, error: { message: 'Unauthorized' } })
    }
  }

  const parsed = SendCodeRequest.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  }

  await sendPersonalAiCode(parsed.data)
  return res.json({ ok: true })
})

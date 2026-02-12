import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import { assistRouter } from './routes/assist'
import { personalAiRouter } from './routes/personalAi'

dotenv.config()

const app = express()
const corsOrigin = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

app.use(helmet())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '1mb' }))
app.use(cors({ origin: corsOrigin.length > 0 ? corsOrigin : true, credentials: true }))

app.get('/health', (_, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() })
})

app.get('/ready', (_, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() })
})

app.use('/assist', assistRouter)
app.use('/personal-ai', personalAiRouter)

const port = process.env.PORT || 4100
app.listen(port, () => {
  console.log(`AI services listening on ${port}`)
})

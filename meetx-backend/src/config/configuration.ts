import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/meetx'),
  JWT_ACCESS_SECRET: z.string().min(1).default('change_me_access'),
  JWT_ACCESS_TTL: z.coerce.number().default(900),
  REFRESH_TTL_DAYS: z.coerce.number().default(7),
  PASSWORD_RESET_TTL_MIN: z.coerce.number().default(30),
  PERSONALAI_CODE_TTL_MIN: z.coerce.number().default(10),
  PERSONALAI_SERVICE_URL: z.string().optional().default(''),
  PERSONALAI_SERVICE_KEY: z.string().optional().default(''),
  PAI_API_BASE: z.string().optional().default(''),
  PAI_SERVICE_KEY: z.string().optional().default(''),
  PAI_TENANT_ID: z.string().optional().default(''),
  PAI_PLATFORM: z.string().optional().default(''),
  COOKIE_DOMAIN: z.string().optional().default(''),
  COOKIE_SECURE: z.coerce.boolean().optional(),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).optional(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  GCS_PROJECT_ID: z.string().optional().default(''),
  GCS_BUCKET: z.string().optional().default(''),
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
})

export type EnvConfig = z.infer<typeof envSchema>

export default () => {
  const env = envSchema.parse(process.env)

  if (env.NODE_ENV === 'production' && env.JWT_ACCESS_SECRET === 'change_me_access') {
    throw new Error('JWT_ACCESS_SECRET must be set in production')
  }

  const cookieDomain = env.COOKIE_DOMAIN && env.COOKIE_DOMAIN.trim().length > 0 ? env.COOKIE_DOMAIN.trim() : undefined
  const cookieSecure = env.COOKIE_SECURE ?? env.NODE_ENV === 'production'
  const cookieSameSite = env.COOKIE_SAMESITE ?? (cookieSecure ? 'none' : 'lax')
  const safeSameSite = cookieSameSite === 'none' && !cookieSecure ? 'lax' : cookieSameSite

  const personalAiServiceUrl = env.PERSONALAI_SERVICE_URL && env.PERSONALAI_SERVICE_URL.trim().length > 0
    ? env.PERSONALAI_SERVICE_URL.trim()
    : undefined

  const personalAiServiceKey = env.PERSONALAI_SERVICE_KEY && env.PERSONALAI_SERVICE_KEY.trim().length > 0
    ? env.PERSONALAI_SERVICE_KEY.trim()
    : undefined

  const paiApiBase = env.PAI_API_BASE && env.PAI_API_BASE.trim().length > 0
    ? env.PAI_API_BASE.trim()
    : undefined

  const paiServiceKey = env.PAI_SERVICE_KEY && env.PAI_SERVICE_KEY.trim().length > 0
    ? env.PAI_SERVICE_KEY.trim()
    : undefined

  const paiTenantId = env.PAI_TENANT_ID && env.PAI_TENANT_ID.trim().length > 0
    ? env.PAI_TENANT_ID.trim()
    : undefined

  const paiPlatform = env.PAI_PLATFORM && env.PAI_PLATFORM.trim().length > 0
    ? env.PAI_PLATFORM.trim()
    : undefined

  return {
    env: env.NODE_ENV,
    port: env.PORT,
    mongodbUri: env.MONGODB_URI,
    jwt: {
      accessSecret: env.JWT_ACCESS_SECRET,
      accessTtl: env.JWT_ACCESS_TTL
    },
    refresh: {
      ttlDays: env.REFRESH_TTL_DAYS
    },
    passwordReset: {
      ttlMinutes: env.PASSWORD_RESET_TTL_MIN
    },
    personalAi: {
      ttlMinutes: env.PERSONALAI_CODE_TTL_MIN,
      serviceUrl: personalAiServiceUrl,
      apiKey: personalAiServiceKey
    },
    pai: {
      apiBase: paiApiBase,
      serviceKey: paiServiceKey,
      tenantId: paiTenantId,
      platform: paiPlatform
    },
    cookie: {
      domain: cookieDomain,
      secure: cookieSecure,
      sameSite: safeSameSite
    },
    corsOrigin: env.CORS_ORIGIN,
    swaggerEnabled: env.SWAGGER_ENABLED,
    logLevel: env.LOG_LEVEL,
    gcs: {
      projectId: env.GCS_PROJECT_ID,
      bucket: env.GCS_BUCKET
    }
  }
}

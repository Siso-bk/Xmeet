type SendCodePayload = {
  email: string
  code: string
  ttlMinutes?: number
  purpose?: string
}

export async function sendPersonalAiCode(payload: SendCodePayload) {
  const env = process.env.NODE_ENV || 'development'
  const masked = payload.code.replace(/^\d{2}/, '$&****')
  const ttl = payload.ttlMinutes ?? 10
  const purpose = payload.purpose || 'auth'

  if (env !== 'production') {
    console.log(`[personal-ai] send code ${masked} to ${payload.email} (ttl ${ttl}m, ${purpose})`)
  } else {
    console.log(`[personal-ai] send code to ${payload.email} (ttl ${ttl}m, ${purpose})`)
  }

  // TODO: integrate with Personal AI delivery channel (email/SMS/inbox)
  return true
}

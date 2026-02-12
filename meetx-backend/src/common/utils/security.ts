import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function randomToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function generateNumericCode(length = 6): string {
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += crypto.randomInt(0, 10).toString()
  }
  return code
}

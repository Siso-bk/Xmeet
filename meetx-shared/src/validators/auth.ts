import { z } from 'zod'

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
})

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const ForgotPasswordDto = z.object({
  email: z.string().email()
})

export const ResetPasswordDto = z.object({
  token: z.string().min(1),
  password: z.string().min(8)
})

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
})

export const PersonalAiRequestCodeDto = z.object({
  email: z.string().email()
})

export const PersonalAiVerifyCodeDto = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  name: z.string().min(1).optional()
})

const strongPassword = z
  .string()
  .min(8)
  .max(128)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Password must include upper, lower, and a number')

export const PaiSignupRequestDto = z.object({
  email: z.string().email()
})

export const PaiSignupVerifyDto = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/)
})

export const PaiSignupCompleteDto = z.object({
  preToken: z.string().min(10),
  name: z.string().min(1),
  password: strongPassword,
  handle: z.string().min(1).max(32)
})

export const PaiLoginDto = z
  .object({
    email: z.string().email().optional(),
    identifier: z.string().min(1).optional(),
    password: strongPassword
  })
  .refine((value) => Boolean(value.email || value.identifier), {
    message: 'Email or identifier is required'
  })

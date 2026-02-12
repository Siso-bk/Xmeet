import type { ApiResponse } from '../../types/common'
import type { Tokens, UserPublic } from '../../types/auth'

export type RegisterRequest = {
  email: string
  password: string
  name: string
}

export type RegisterResponse = ApiResponse<{ user: UserPublic }>

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = ApiResponse<{ user: UserPublic; tokens: Tokens }>

export type RefreshResponse = ApiResponse<{ tokens: Tokens }>

export type MeResponse = ApiResponse<{ user: UserPublic }>

export type ForgotPasswordRequest = {
  email: string
}

export type ForgotPasswordResponse = ApiResponse<{ resetToken?: string }>

export type ResetPasswordRequest = {
  token: string
  password: string
}

export type ResetPasswordResponse = ApiResponse<{ status: 'ok' }>

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export type ChangePasswordResponse = ApiResponse<{ status: 'ok' }>

export type PersonalAiRequestCodeRequest = {
  email: string
}

export type PersonalAiRequestCodeResponse = ApiResponse<{ code?: string }>

export type PersonalAiVerifyCodeRequest = {
  email: string
  code: string
  name?: string
}

export type PersonalAiVerifyCodeResponse = ApiResponse<{ user: UserPublic; tokens: Tokens }>

export type PaiSignupRequest = {
  email: string
}

export type PaiSignupResponse = ApiResponse<{
  exists?: boolean
  emailVerified?: boolean
  profileCompleted?: boolean
  message?: string
  devVerificationCode?: string
}>

export type PaiSignupVerifyRequest = {
  email: string
  code: string
}

export type PaiSignupVerifyResponse = ApiResponse<{ preToken: string }>

export type PaiSignupCompleteRequest = {
  preToken: string
  name: string
  password: string
  handle: string
}

export type PaiSignupCompleteResponse = ApiResponse<{ user: UserPublic; tokens: Tokens; paiToken: string }>

export type PaiLoginRequest = {
  email?: string
  identifier?: string
  password: string
}

export type PaiLoginResponse = ApiResponse<{ user: UserPublic; tokens: Tokens; paiToken: string }>

import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  PersonalAiRequestCodeDto,
  PersonalAiVerifyCodeDto,
  PaiLoginDto,
  PaiSignupRequestDto,
  PaiSignupVerifyDto,
  PaiSignupCompleteDto
} from '@meetx/shared'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { REFRESH_COOKIE, setRefreshCookie, clearRefreshCookie } from '../../common/utils/cookies'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterDto))
  async register(@Body() body: any) {
    const user = await this.authService.register(body)
    return { user }
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { user, tokens, refreshToken } = await this.authService.login(body)
    setRefreshCookie(res, refreshToken, this.authService.getRefreshTtlDays(), {
      domain: this.authService.cookieDomain,
      secure: this.authService.cookieSecure,
      sameSite: this.authService.cookieSameSite
    })
    return { user, tokens }
  }

  @Post('pai/login')
  @UsePipes(new ZodValidationPipe(PaiLoginDto))
  async paiLogin(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { user, tokens, refreshToken, paiToken } = await this.authService.loginWithPai(body)
    setRefreshCookie(res, refreshToken, this.authService.getRefreshTtlDays(), {
      domain: this.authService.cookieDomain,
      secure: this.authService.cookieSecure,
      sameSite: this.authService.cookieSameSite
    })
    return { user, tokens, paiToken }
  }

  @Post('pai/request-code')
  @UsePipes(new ZodValidationPipe(PaiSignupRequestDto))
  async paiRequestCode(@Body() body: any) {
    return this.authService.requestPaiSignupCode(body.email)
  }

  @Post('pai/verify-code')
  @UsePipes(new ZodValidationPipe(PaiSignupVerifyDto))
  async paiVerifyCode(@Body() body: any) {
    return this.authService.verifyPaiSignupCode(body.email, body.code)
  }

  @Post('pai/complete')
  @UsePipes(new ZodValidationPipe(PaiSignupCompleteDto))
  async paiComplete(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { user, tokens, refreshToken, paiToken } = await this.authService.completePaiSignup(body)
    setRefreshCookie(res, refreshToken, this.authService.getRefreshTtlDays(), {
      domain: this.authService.cookieDomain,
      secure: this.authService.cookieSecure,
      sameSite: this.authService.cookieSameSite
    })
    return { user, tokens, paiToken }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE]
    const tokens = await this.authService.refresh(token)
    setRefreshCookie(res, tokens.refreshToken, this.authService.getRefreshTtlDays(), {
      domain: this.authService.cookieDomain,
      secure: this.authService.cookieSecure,
      sameSite: this.authService.cookieSameSite
    })
    return { tokens: tokens.access }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE]
    await this.authService.logout(token)
    clearRefreshCookie(res, {
      domain: this.authService.cookieDomain,
      secure: this.authService.cookieSecure,
      sameSite: this.authService.cookieSameSite
    })
    return { ok: true }
  }

  @Post('forgot-password')
  @UsePipes(new ZodValidationPipe(ForgotPasswordDto))
  async forgotPassword(@Body() body: any) {
    return this.authService.requestPasswordReset(body.email)
  }

  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(ResetPasswordDto))
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.token, body.password)
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(ChangePasswordDto))
  async changePassword(@CurrentUser() user: any, @Body() body: any) {
    return this.authService.changePassword(user.id, body.currentPassword, body.newPassword)
  }

  @Post('personal-ai/request-code')
  @UsePipes(new ZodValidationPipe(PersonalAiRequestCodeDto))
  async requestPersonalAiCode(@Body() body: any) {
    return this.authService.requestPersonalAiCode(body.email)
  }

  @Post('personal-ai/verify-code')
  @UsePipes(new ZodValidationPipe(PersonalAiVerifyCodeDto))
  async verifyPersonalAiCode(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { user, tokens, refreshToken } = await this.authService.verifyPersonalAiCode(
      body.email,
      body.code,
      body.name
    )

    setRefreshCookie(res, refreshToken, this.authService.getRefreshTtlDays(), {
      domain: this.authService.cookieDomain,
      secure: this.authService.cookieSecure,
      sameSite: this.authService.cookieSameSite
    })

    return { user, tokens }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    return { user }
  }
}

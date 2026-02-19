import type { $Fetch, NitroFetchRequest } from 'nitropack'

import type { LoginDto } from './dto/login.dto'
import type { LogoutDto } from './dto/logout.dto'
import type { SignupDto } from './dto/signup.dto'
import type { ForgotPasswordDto } from './dto/forgot-password.dto'
import type { ResetPasswordDto } from './dto/reset-password.dto'
import type { AuthSessionSchema } from '~/types/login'

export function authRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async login(loginDto: LoginDto): Promise<AuthSessionSchema> {
      return fetch<AuthSessionSchema>('auth/login', {
        method: 'POST',
        body: loginDto,
      })
    },
    async logout(logoutDto: LogoutDto): Promise<void> {
      return fetch<void>('auth/logout', {
        method: 'POST',
        body: logoutDto,
      })
    },
    async signup(signupDto: SignupDto): Promise<AuthSessionSchema> {
      return fetch<AuthSessionSchema>('auth/signup', {
        method: 'POST',
        body: signupDto,
      })
    },
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
      return fetch<{ message: string }>('auth/forgot-password', {
        method: 'POST',
        body: forgotPasswordDto,
      })
    },
    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
      return fetch<{ message: string }>('auth/reset-password', {
        method: 'POST',
        body: resetPasswordDto,
      })
    },
  }
}

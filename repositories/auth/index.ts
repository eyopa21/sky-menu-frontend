import type { $Fetch, NitroFetchRequest } from 'nitropack'

import type { LoginDto } from './dto/login.dto'
import type { AuthSessionSchema } from '~/types/login'

export function authRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async login(loginDto: LoginDto): Promise<AuthSessionSchema> {
      return fetch<AuthSessionSchema>('auth/login', {
        method: 'POST',
        body: loginDto,
      })
    },
  }
}

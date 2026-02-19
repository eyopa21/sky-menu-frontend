import type { $Fetch, NitroFetchRequest } from 'nitropack'

import type { User } from '~/types/login'
import type { TUpdateAccountValidationSchema } from '~/zod/AccountUpdate'

export function userRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async updateMyAccount(userId: number, updateAccountDto: TUpdateAccountValidationSchema): Promise<User> {
      return fetch<User>(`/users/${userId}`, {
        method: 'PATCH',
        body: updateAccountDto,
      })
    },
  }
}

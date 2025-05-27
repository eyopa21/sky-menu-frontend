import type { NitroFetchRequest, $Fetch } from "nitropack";

import type { TUpdateAccountValidationSchema } from "~/zod/AccountUpdate";
import type { User } from "~/types/login";


export const userRepository =<T> (fetch: $Fetch<T, NitroFetchRequest>) => ({
    async updateMyAccount(userId: number, updateAccountDto: TUpdateAccountValidationSchema): Promise<User> {
        return fetch<User>(`/users/${userId}`, {
            method: 'PATCH', 
            body: updateAccountDto
        })
    }
})
import type { NitroFetchRequest, $Fetch } from "nitropack";

import type { AuthSessionSchema, User } from "~/types/login";
import type { LoginDto } from "./dto/login.dto";

export const authRepository =<T> (fetch: $Fetch<T, NitroFetchRequest>) => ({
    async login(loginDto: LoginDto): Promise<AuthSessionSchema> {
        return fetch<AuthSessionSchema>('auth/login', {
            method: 'POST', 
            body: loginDto
        })

    }
})
import type { NitroFetchRequest, $Fetch } from "nitropack";

import type { User } from "~/types/login";
import type { LoginDto } from "./dto/login.dto";

export const authRepository =<T> (fetch: $Fetch<T, NitroFetchRequest>) => ({
    async login(loginDto: LoginDto): Promise<User[]> {
        return fetch<User[]>('auth/login', {
            method: 'POST', 
            body: loginDto
        })

    }
})
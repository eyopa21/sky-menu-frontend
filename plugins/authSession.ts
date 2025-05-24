import type { AuthSessionSchema } from '~/types/login'

export default defineNuxtPlugin({
  name: 'authentication',
  async setup() {
    // Temporarily remove decode function due to nuxt issue (see https://github.com/nuxt/nuxt/issues/27246)
    const sessionCookie = useCookie('auth_session', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    })

    const session = computed<AuthSessionSchema | null>(() => {
      if (!sessionCookie.value) {
        return null
      }
      try {
        if (typeof sessionCookie.value === 'object') {
          return sessionCookie.value as AuthSessionSchema
        }
        const data = JSON.parse(sessionCookie.value)
        return data as AuthSessionSchema
      } catch {
        console.warn(`Error parsing session cookie, received value that is not JSON serializable (${sessionCookie.value})`)
        return null
      }
    })

    const loggedIn = computed<boolean>(() => {
      return session.value !== null && typeof session.value.accessToken === 'string'
    })

    const accessToken = computed<string | null>(() => {
      if (loggedIn.value) {
        return session.value?.accessToken ?? null
      }
      return null
    })

    const userId = computed<number | null>(() => {
      if (loggedIn.value) {
        return session.value?.user.id ?? null
      }
      return null
    })

    const updateSession = (candidate: AuthSessionSchema | null) => {
      sessionCookie.value = candidate && JSON.stringify(candidate)
    }

    const logout = () => {
      updateSession(null)
      navigateTo('/')
    }

    return {
      provide: {
        authentication: {
          session,
          loggedIn,
          updateSession,
          accessToken,
          userId,
          logout,
        },
      },
    }
  },
})

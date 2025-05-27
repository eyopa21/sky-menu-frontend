import { defineStore } from 'pinia'
import type { AuthSessionSchema } from '~/types/login'

export const useAuthStore = defineStore('auth', () => {
  const redirectTo = useCookie('redirectTo')
  const session = ref<AuthSessionSchema | null>(null)

  const isLoggedIn = computed(() => {
    return session.value !== null && typeof session.value.accessToken === 'string'
  })

  const accessToken = computed(() => {
    if (isLoggedIn.value) {
      return session.value?.accessToken ?? null
    }
    return null
  })

  const userId = computed(() => {
    if (isLoggedIn.value) {
      return session.value?.user.id ?? null
    }
    return null
  })

  const updateSession = (candidate: AuthSessionSchema | null) => {
    session.value = candidate
  }



  const setRedirectTarget = (to: string) => {
    redirectTo.value = to
  }

  const clearRedirect = () => {
    redirectTo.value = null
  }

  const promptLogin = (withRedirect: string | undefined = undefined) => {
    updateSession(null)
    if (withRedirect) {
      setRedirectTarget(withRedirect)
    }
    return navigateTo('/auth/login')
  }

  const logout = () => {
    updateSession(null)
    clearRedirect()
    return navigateTo('/auth/login')
  }

 

  return {
    session,
    isLoggedIn,
    redirectTo,
    updateSession,
    setRedirectTarget,
    clearRedirect,
    accessToken,
    userId,
    promptLogin,
    logout,
  }
}, {
  persist: {
    pick: ['session'],
  },
})

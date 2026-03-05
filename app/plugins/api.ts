import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.restApiUrl as string || 'https://api.mesobmenu.com'
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      // Add Bearer token if it exists
      const token = authStore.accessToken
      if (token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${token}`)
      }

      // Handle server-side cookies if needed (though usually token is enough)
      if (process.server) {
        const headers = useRequestHeaders(['cookie'])
        if (headers.cookie) {
          options.headers = options.headers || new Headers(options.headers)
          // Note: If using Bearer tokens, we might NOT need to forward cookies, 
          // but we keep it here just in case some endpoints still use them.
          options.headers.set('cookie', headers.cookie)
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        console.log('Unauthorized access - prompting login')
        // Only prompt login on client side to avoid redirects during SSR if possible
        if (process.client) {
          authStore.promptLogin(window.location.pathname)
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})

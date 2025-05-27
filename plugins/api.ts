import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin({
  name: 'api',
  dependsOn: ['authentication'],
  async setup() {
    const config = useRuntimeConfig()
    const baseURL = config.public.restApiUrl
    const authStore = useAuthStore()
    const { accessToken } = storeToRefs(authStore)
    const api = $fetch.create({
      baseURL,

      onRequest({ request, options, error }) {
        if (accessToken) {
          options.headers.set('Authorization', `Bearer ${accessToken.value}`)
        }
      },

      async onResponseError({ response }) {
        if (response.status === 401) {
          console.log('Unauthorized access - redirecting to login')
          //   await nuxtApp.runWithContext(() => navigateTo('/login'))
        }
      },
    })
    return {
      provide: {
        api,
      },
    }
  },

})

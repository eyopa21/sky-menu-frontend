export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseURL = 'http://localhost:3000'

  const api = $fetch.create({
    baseURL,
    credentials: 'include',

    onRequest({ options }) {
  if (process.server) {
    const headers = useRequestHeaders(['cookie'])

    if (headers.cookie) {
      options.headers = new Headers(options.headers)
      options.headers.set('cookie', headers.cookie)
    }
  }
},


    async onResponseError({ response }) {
      if (response.status === 401) {
        console.log('Unauthorized access')
        // await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })

  return {
    provide: {
      api
    }
  }
})

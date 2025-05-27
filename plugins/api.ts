export default defineNuxtPlugin({
    name: 'api',
    dependsOn: ['authentication'],
    async setup() {
        const config = useRuntimeConfig()
        const baseURL = config.public.restApiUrl
        const { $authentication } =  useNuxtApp()
        const accessToken = $authentication?.accessToken.value
        const api = $fetch.create({
            baseURL, 
           
            onRequest({ request, options, error }) {
                if (accessToken) {
                  options.headers.set('Authorization', `Bearer ${accessToken}`)
                }
              },

              async onResponseError({ response }) {
                if (response.status === 401) {
                    console.log('Unauthorized access - redirecting to login')
                //   await nuxtApp.runWithContext(() => navigateTo('/login'))
                }
              }
        })
        return {
            provide: {
                api
            }
        }
    }

})
export default defineNuxtPlugin({
    name: 'api',
    setup() {
        const config = useRuntimeConfig()
        const baseURL = config.public.restApiUrl

        const api = $fetch.create({
            baseURL, 
        })
        return {
            provide: {
                api
            }
        }
    }

})
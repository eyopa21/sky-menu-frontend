// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss'
  ], 

  
  primevue: {
    autoImport: true,
    options: {
        theme: {
            preset: Aura
        }
    }
},
  runtimeConfig: {
    public: {
      restApiUrl: process.env.NUXT_PUBLIC_REST_API_URL ,
    }
  }
})
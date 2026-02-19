// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({

  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  // runtimeConfig: {
  //   public: {
  //     apiBase: 'http://localhost:3000'
  //   }
  // },



  css: ['~/assets/css/tailwind.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },




  runtimeConfig: {
    public: {
      restApiUrl: process.env.NUXT_PUBLIC_REST_API_URL,
    },
  },
})











































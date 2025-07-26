// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {},
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
    ],
    experimental: {
      localeDetector: 'localeDetector.ts',
    },
  },
});

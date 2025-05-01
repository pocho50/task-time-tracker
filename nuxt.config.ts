import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  routeRules: {
    '/': { redirect: '/projects' },
  },
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s - Time task tracker',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    [
      '@vee-validate/nuxt',
      {
        // disable or enable auto imports
        autoImports: true,
        // Use different names for components
        componentNames: {
          Form: 'VeeForm',
          Field: 'VeeField',
          FieldArray: 'VeeFieldArray',
          ErrorMessage: 'VeeErrorMessage',
        },
      },
    ],
    [
      '@nuxtjs/i18n',
      {
        lazy: true,
        defaultLocale: 'en',
        locales: [
          {
            code: 'en',
            file: 'en.json',
          },
        ],
        strategy: 'no_prefix',
      },
    ],
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/app.css'],
});

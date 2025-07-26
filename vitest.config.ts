import { defineVitestConfig } from '@nuxt/test-utils/config';
import { configDefaults } from 'vitest/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    exclude: ['e2e/**/*', ...configDefaults.exclude],
    server: {
      deps: {
        inline: [
          '@nuxt/image',
          '@nuxtjs/i18n',
          'nuxt-auth-utils',
          'nuxt-zod-i18n',
        ],
      },
    },
  },
});

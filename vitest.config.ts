import { defineVitestConfig } from '@nuxt/test-utils/config';
import { configDefaults } from 'vitest/config';

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    exclude: ['e2e/**/*', ...configDefaults.exclude],
  },
});

import { defineConfig } from '@playwright/test';
import type { ConfigOptions } from '@nuxt/test-utils/playwright';
import { fileURLToPath } from 'node:url';

export default defineConfig<ConfigOptions>({
  testDir: './e2e',
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});

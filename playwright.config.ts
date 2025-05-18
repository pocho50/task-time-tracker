import { defineConfig, devices } from '@playwright/test';
import type { ConfigOptions } from '@nuxt/test-utils/playwright';
import { fileURLToPath } from 'node:url';

const baseURL = process.env.BASE_URL || `http://localhost:3000`;

export default defineConfig<ConfigOptions>({
  testDir: './e2e',
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
      host: baseURL,
    },
    baseURL,
  },
  projects: [
    // Setup project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'logged',

      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      testMatch: /^(?!.*\/loginPage\/).*\.test\.ts$/,
      dependencies: ['setup'],
    },
    {
      name: 'not-logged',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /loginPage\/.*\.test\.ts/,
      dependencies: ['setup'],
    },
  ],
});

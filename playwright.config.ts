import { defineConfig, devices } from '@playwright/test';
import type { ConfigOptions } from '@nuxt/test-utils/playwright';
import { fileURLToPath } from 'node:url';

const baseURL = process.env.BASE_URL || `http://localhost:3030`;

export default defineConfig<ConfigOptions>({
  testDir: './e2e',
  timeout: 60000,
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
      host: baseURL,
    },
    baseURL,
    actionTimeout: 10000,
  },
  projects: [
    // Setup project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'not-logged',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /loginPage\/.*\.test\.ts/,
      dependencies: ['setup'],
    },

    {
      name: 'logged-task',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      testMatch: /taskPage\/task\.test\.ts/,
      dependencies: ['setup'],
    },
    {
      name: 'logged-time-tracking',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      testMatch: /taskPage\/time-tracking\.test\.ts/,
      dependencies: ['logged-task'],
    },
    {
      name: 'logged-other',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      testMatch: /^(?!.*\/loginPage\/).*\.test\.ts$/,
      testIgnore: [
        /taskPage\/task\.test\.ts/,
        /taskPage\/time-tracking\.test\.ts/,
      ],
      dependencies: ['setup'],
    },
  ],
});

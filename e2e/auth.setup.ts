import { test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ request }) => {
  await request.post('/api/login', {
    form: {
      email: 'admin@admin.com',
      password: 'admin123',
    },
  });
  await request.storageState({ path: authFile });
});

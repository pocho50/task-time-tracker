import { test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ request }) => {
  await request.post('/api/login', {
    form: {
      email: 'test@test.com',
      password: 'password',
    },
  });
  await request.storageState({ path: authFile });
});

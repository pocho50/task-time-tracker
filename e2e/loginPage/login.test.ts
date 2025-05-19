import { expect, test } from '@nuxt/test-utils/playwright';
import LoginPage from '../page-objects/loginPage';

const badUser = {
  email: 'test@test.com',
  password: 'bad-password',
};

const goodUser = {
  email: 'test@test.com',
  password: 'password',
};
test.describe('login', async () => {
  test.beforeEach(async ({ goto }) => {
    await goto('/login', { waitUntil: 'hydration' });
  });
  test('fail login should show error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.getEmailInput().fill(badUser.email);

    await loginPage.getPasswordInput().fill(badUser.password);

    await loginPage.getLoginButton().click();

    // toasts should have one item
    const allToasts = page.getByTestId('toasts').getByRole('alert');
    await expect(allToasts).toHaveCount(1);

    // with class alert-error
    await expect(allToasts.nth(0)).toContainClass('alert-error');
  });

  test('success login should redirect to projects', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.getEmailInput().fill(goodUser.email);

    await loginPage.getPasswordInput().fill(goodUser.password);

    await loginPage.getLoginButton().click();

    // should redirect to projects
    await expect(page).toHaveURL('/projects');
  });
});

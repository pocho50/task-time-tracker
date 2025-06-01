import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/users/i18n/locales/en.json' assert { type: 'json' };
import UserPage from '../page-objects/userPage';
import { fetchApiData, removeItem } from '../helpers/api';
import type { User } from '@prisma/client';
import type { Page } from '@playwright/test';

let userPage: UserPage;
const URL_API = '/api/users';

const dumyUser = {
  name: 'test',
  email: 'test123@test123.com',
  role: 'ADMIN',
  password: 'Test1245678',
  repeatPassword: 'Test1245678',
} as UserDataForm;

async function removeDumyUser(page: Page) {
  const usersFromApi = await fetchApiData<User>(page, URL_API);
  const userDeleted = usersFromApi.find(
    (user) => user.email === dumyUser.email
  );
  if (userDeleted) {
    await removeItem(page, URL_API, userDeleted.id);
  }
}

test.describe('user', async () => {
  test.beforeEach(async ({ goto, page }) => {
    await goto('/users', { waitUntil: 'hydration' });
    userPage = new UserPage(page);
    await removeDumyUser(page);
  });

  test.afterEach(async ({ page }) => {
    await removeDumyUser(page);
  });

  test('check heading', async () => {
    await expect(userPage.getHeading()).toHaveText(en.userList.title);
  });

  test('check users list matches API data', async ({ page }) => {
    const usersFromApi = await fetchApiData(page, URL_API);
    await expect(userPage.getUsersListItems()).toHaveCount(usersFromApi.length);
  });

  test('add new user', async ({ page }) => {
    const usersFromApi = await fetchApiData(page, URL_API);
    // click add user button
    await userPage.getAddUserButton().click();
    // fill form
    await userPage.fillForm(dumyUser);
    // submit form
    await userPage.getFormSubmitButton().click();
    // check user is added
    await expect(userPage.getUsersListItems()).toHaveCount(
      usersFromApi.length + 1
    );
  });
});

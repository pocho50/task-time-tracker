import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/users/i18n/locales/en.json' assert { type: 'json' };
import RolePage from '../page-objects/rolePage';
import { RoleTestHelper, TEST_CONSTANTS } from '../helpers/roleTestHelpers';

test.describe('roles', async () => {
  let rolePage: RolePage;
  let testHelper: RoleTestHelper;

  test.beforeEach(async ({ goto, page }) => {
    testHelper = new RoleTestHelper(page);
    rolePage = new RolePage(page);

    await goto('/roles', { waitUntil: 'hydration' });
    await testHelper.removeDummyRole();
  });

  test.afterEach(async () => {
    await testHelper.removeDummyRole();
  });

  test('check heading', async () => {
    await expect(rolePage.getHeading()).toHaveText(en.roleList.title);
  });

  test('check roles list matches API data', async () => {
    const rolesFromApi = await testHelper.getRoles();
    await expect(rolePage.getRoleListItems()).toHaveCount(rolesFromApi.length);
  });

  test('add new role and remove', async ({ page }) => {
    const rolesFromApi = await testHelper.getRoles();

    await rolePage.getAddRoleButton().click();
    await rolePage.fillForm(TEST_CONSTANTS.DUMMY_ROLE);
    await rolePage.getFormSubmitButton().click();

    await expect(rolePage.getRoleList()).toBeVisible();
    await expect(rolePage.getRoleListItems()).toHaveCount(
      rolesFromApi.length + 1
    );

    const roleAdded = await testHelper.findRoleByKey(
      TEST_CONSTANTS.DUMMY_ROLE.key
    );
    expect(roleAdded).toBeTruthy();

    await (
      await rolePage.getDeleteRoleButton(TEST_CONSTANTS.DUMMY_ROLE.key)
    ).click();
    await expect(rolePage.getRemoveModal()).toBeVisible();
    await rolePage.getRemoveModalConfirmButton().click();

    await expect(rolePage.getRoleListItems()).toHaveCount(rolesFromApi.length);
  });
});

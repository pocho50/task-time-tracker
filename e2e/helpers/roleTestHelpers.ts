import type { Page } from '@playwright/test';
import { removeItem } from './api';
import { BaseTestHelper } from './baseTestHelper';

export const TEST_CONSTANTS = {
  URLS: {
    ROLES_API: '/api/roles',
  },
  DUMMY_ROLE: {
    key: 'TEST_E2E_ROLE',
    name: 'Test E2E Role',
  },
};

export class RoleTestHelper extends BaseTestHelper {
  constructor(page: Page) {
    super(page);
  }

  async getRoles() {
    const response = await this.page.request.get(TEST_CONSTANTS.URLS.ROLES_API);
    const data = await response.json();
    return data.data ?? [];
  }

  async findRoleByKey(roleKey: string) {
    const roles = await this.getRoles();
    if (!roles || !Array.isArray(roles)) return null;
    return roles.find((r: any) => r.key === roleKey) || null;
  }

  async removeDummyRole() {
    const role = await this.findRoleByKey(TEST_CONSTANTS.DUMMY_ROLE.key);
    if (role) {
      await removeItem(this.page, TEST_CONSTANTS.URLS.ROLES_API, role.key);
    }
  }
}

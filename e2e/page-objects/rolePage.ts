import type { Page } from '@playwright/test';
import en_shared from '#layers/shared/i18n/locales/en.json' assert { type: 'json' };
import type { RoleDataForm } from '../types/role';

export default class RolePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public getHeading() {
    return this.page.getByRole('heading', { level: 3 });
  }

  public getRoleList() {
    return this.page.getByTestId('role-list');
  }

  public getRoleListItems() {
    return this.getRoleList().locator('tbody tr');
  }

  public getAddRoleButton() {
    return this.page.getByTestId('add-button');
  }

  public getRoleForm() {
    return this.page.getByTestId('role-form');
  }

  public async fillForm(data: RoleDataForm) {
    await this.getFormKeyInput().fill(data.key);
    await this.getFormNameInput().fill(data.name);
  }

  public getFormKeyInput() {
    return this.getRoleForm().locator('input[name="key"]');
  }

  public getFormNameInput() {
    return this.getRoleForm().locator('input[name="name"]');
  }

  public getFormSubmitButton() {
    return this.page.getByTestId('role-form-submit');
  }

  public async getDeleteRoleButton(roleKey: string) {
    await this.page
      .getByTestId(`role-actions-${roleKey}`)
      .getByRole('button')
      .first()
      .click();

    return this.page
      .getByTestId(`role-actions-${roleKey}`)
      .getByText(en_shared.common.delete);
  }

  public getRemoveModal() {
    return this.page.getByRole('dialog');
  }

  public getRemoveModalConfirmButton() {
    return this.getRemoveModal().getByRole('button', {
      name: en_shared.common.delete,
    });
  }
}

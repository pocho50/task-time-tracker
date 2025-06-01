import { type Page } from '@playwright/test';

export default class UserPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  getHeading() {
    return this.page.getByRole('heading', { level: 3 });
  }

  getUsersListItems() {
    // Assuming users are rendered as rows in a table
    return this.page.locator('table tbody tr');
  }

  getAddUserButton() {
    return this.page.getByTestId('add-button');
  }

  getUserForm() {
    return this.page.getByTestId('user-form');
  }

  async fillForm(data: UserDataForm) {
    await this.getFormNameInput().fill(data.name);
    await this.getFormEmailInput().fill(data.email);
    await this.getFormRoleSelect().selectOption(data.role);
    await this.getFormPasswordInput().fill(data.password!);
    await this.getFormRepeatPasswordInput().fill(data.repeatPassword!);
  }

  getFormNameInput() {
    return this.getUserForm().getByRole('textbox', { name: 'name' });
  }

  getFormEmailInput() {
    return this.getUserForm().getByRole('textbox', { name: 'email' });
  }

  getFormRoleSelect() {
    return this.getUserForm().getByRole('combobox', { name: 'role' });
  }

  getFormPasswordInput() {
    return this.getUserForm().getByRole('textbox', {
      name: 'Password',
      exact: true,
    });
  }

  getFormRepeatPasswordInput() {
    return this.getUserForm().getByRole('textbox', {
      name: 'Repeat password',
      exact: true,
    });
  }

  getFormSubmitButton() {
    return this.page.getByTestId('user-form-submit');
  }
}

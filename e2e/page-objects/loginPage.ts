import type { Page } from '@playwright/test';
export default class LoginPage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public getEmailInput() {
    return this.page.getByTestId('login-email').getByRole('textbox');
  }

  public getPasswordInput() {
    return this.page.getByTestId('login-password').getByRole('textbox');
  }

  public getLoginButton() {
    return this.page.getByTestId('login-button');
  }
}

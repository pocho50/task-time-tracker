import { type Page } from '@playwright/test';
export default class LayoutPage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getDesktopToggleDrawerButton() {
    return this.page.getByTestId('toggle-drawer');
  }

  getMobileToggleDrawerButton() {
    return this.page.getByTestId('toggle-drawer-mobile');
  }
}

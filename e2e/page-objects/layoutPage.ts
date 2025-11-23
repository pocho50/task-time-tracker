import type { Page } from '@playwright/test';
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

  getMenu() {
    return this.page.getByTestId('menu');
  }

  getAside() {
    return this.page.getByTestId('aside');
  }
}

import { type Page } from '@playwright/test';
export default class ProjectPage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  public getProjectsList() {
    return this.page.getByTestId('project-list');
  }

  public getProjectsListItems() {
    return this.getProjectsList().getByRole('article');
  }

  public getHeading() {
    return this.page.getByRole('heading', { level: 3 });
  }
}

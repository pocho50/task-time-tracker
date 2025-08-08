import { type Page } from '@playwright/test';
import en from '#layers/sprints/i18n/locales/en.json' assert { type: 'json' };
import en_shared from '#layers/shared/i18n/locales/en.json' assert { type: 'json' };
import type { SprintDataForm } from '../types/sprint';

export default class SprintPage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public getHeading() {
    return this.page.getByRole('heading', { level: 3 });
  }

  public getSprintList() {
    return this.page.getByTestId('sprint-list');
  }

  public getSprintListItems() {
    return this.getSprintList().locator('tbody tr');
  }

  public getProjectSelector() {
    return this.page.getByRole('combobox', { name: en.sprintList.selectProject });
  }

  public async selectProject(projectName: string) {
    await this.getProjectSelector().click();
    await this.page.getByText(projectName).click();
  }

  public getAddSprintButton() {
    return this.page.getByTestId('add-button');
  }

  public getSprintForm() {
    return this.page.locator('form');
  }

  public async fillForm(data: SprintDataForm) {
    await this.getFormNameInput().fill(data.name);
    await this.getFormStartDateInput().fill(data.startDate);
    await this.getFormEndDateInput().fill(data.endDate);
    await this.getFormStatusSelect().selectOption(data.status);
  }

  public getFormNameInput() {
    return this.page.getByRole('textbox', { name: /name/i });
  }

  public getFormStartDateInput() {
    return this.page.locator('input[name="startDate"]');
  }

  public getFormEndDateInput() {
    return this.page.locator('input[name="endDate"]');
  }

  public getFormStatusSelect() {
    return this.page.locator('select[name="status"]');
  }

  public getFormSubmitButton() {
    return this.page.getByRole('button', { name: /submit|save|create/i });
  }

  public async getEditSprintButton(sprintId: string) {
    // First click on the dropdown trigger (the dots icon) to open the menu
    await this.page
      .getByTestId(`sprint-actions-${sprintId}`)
      .getByRole('button')
      .first()
      .click();
    // Then get the edit option from the dropdown menu
    return this.page
      .getByTestId(`sprint-actions-${sprintId}`)
      .getByText(en_shared.common.edit);
  }

  public async getDeleteSprintButton(sprintId: string) {
    // First click on the dropdown trigger (the dots icon) to open the menu
    await this.page
      .getByTestId(`sprint-actions-${sprintId}`)
      .getByRole('button')
      .first()
      .click();
    // Then get the delete option from the dropdown menu
    return this.page
      .getByTestId(`sprint-actions-${sprintId}`)
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

import { type Page } from '@playwright/test';
import en from '#layers/tasks/i18n/locales/en.json' assert { type: 'json' };
import en_shared from '#layers/shared/i18n/locales/en.json' assert { type: 'json' };
import type { TaskDataForm } from '../types/task';

export default class TaskPage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public getHeading() {
    return this.page.getByRole('heading', { level: 3 });
  }

  public getTaskList() {
    return this.page.getByTestId('task-list');
  }

  public getTaskListItems() {
    return this.getTaskList().locator('tbody tr');
  }

  public getProjectSelector() {
    return this.page.getByRole('combobox', { name: en.taskList.selectProject });
  }

  public async selectProject(projectName: string) {
    await this.getProjectSelector().click();
    await this.page.getByText(projectName, { exact: true }).click();
  }

  public getSprintSelector() {
    return this.page.getByRole('combobox', { name: en.taskList.selectSprint });
  }

  public async selectSprint(sprintName: string) {
    await this.getSprintSelector().click();
    await this.page.getByText(sprintName, { exact: true }).click();
  }

  public getAddTaskButton() {
    return this.page.getByTestId('add-button');
  }

  public getTaskForm() {
    return this.page.locator('form');
  }

  public async fillForm(data: TaskDataForm) {
    await this.getFormNameInput().fill(data.name);
    if (data.description) {
      await this.getFormDescriptionInput().fill(data.description);
    }
    await this.getFormPrioritySelect().selectOption(data.priority);
    await this.getFormStatusSelect().selectOption(data.status);
    if (data.estimatedHours) {
      await this.getFormEstimatedHoursInput().fill(
        data.estimatedHours.toString()
      );
    }
  }

  public getFormNameInput() {
    return this.page.getByRole('textbox', { name: /task name/i });
  }

  public getFormDescriptionInput() {
    return this.page.getByRole('textbox', { name: /description/i });
  }

  public getFormPrioritySelect() {
    return this.page.locator('select[name="priority"]');
  }

  public getFormStatusSelect() {
    return this.page.locator('select[name="status"]');
  }

  public getFormEstimatedHoursInput() {
    return this.page.locator('input[name="estimatedHours"]');
  }

  public getFormSubmitButton() {
    return this.page.getByRole('button', { name: /submit|save|create/i });
  }

  public async getEditTaskButton(taskId: string) {
    // First click on the dropdown trigger (the dots icon) to open the menu
    await this.page
      .getByTestId(`task-actions-${taskId}`)
      .getByRole('button')
      .first()
      .click();
    // Then get the edit option from the dropdown menu
    return this.page
      .getByTestId(`task-actions-${taskId}`)
      .getByText(en_shared.common.edit);
  }

  public getEmptyState() {
    return this.page.getByText(en.taskList.selectSprintToView);
  }
}

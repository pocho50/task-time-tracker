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

  public getTaskRow(taskName: string) {
    return this.page
      .getByTestId('task-row')
      .filter({ hasText: taskName })
      .first();
  }

  public async startTaskTimer(taskName: string) {
    const row = this.getTaskRow(taskName);
    const startButton = row.getByTestId('start-timer-button');
    await startButton.click();
  }

  public async stopTaskTimer(taskName: string) {
    const row = this.getTaskRow(taskName);
    const stopButton = row.getByTestId('pause-timer-button');
    await stopButton.click();
  }

  public async editActiveSession(taskName: string) {
    const row = this.getTaskRow(taskName);
    const editButton = row.getByTestId('edit-active-session-button');
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  public async openTaskHistory(taskName: string) {
    const row = this.getTaskRow(taskName);
    // First click on the dropdown trigger (the dots icon) to open the menu
    // The actions column is the last one
    const actionsCell = row.locator('td').last();
    await actionsCell.getByRole('button').first().click();

    // Then click History from the dropdown within the same row
    const historyAction = actionsCell.getByTestId('task-history-action');
    await historyAction.waitFor({ state: 'visible' });
    await historyAction.click();
  }

  public async editHistorySession(index: number = 0) {
    // The history is in a drawer
    // We look for buttons that match the pattern 'edit-history-session-button-*'
    // Since IDs are dynamic, we get all matching elements and select by index
    const editButtons = this.page.locator(
      '[data-testid^="edit-history-session-button-"]'
    );
    await editButtons.nth(index).click();
  }

  public getTimerButton(taskName: string, state: 'start' | 'pause') {
    const row = this.getTaskRow(taskName);
    return row.getByTestId(
      `${state === 'start' ? 'start' : 'pause'}-timer-button`
    );
  }

  public getStartTimerButton(taskName: string) {
    return this.getTimerButton(taskName, 'start');
  }

  public getPauseTimerButton(taskName: string) {
    return this.getTimerButton(taskName, 'pause');
  }

  public async fillSessionForm(data: {
    start?: string;
    end?: string;
    notes?: string;
  }) {
    // Target the visible dialog with the expected title
    const dialog = this.page.getByRole('dialog', {
      name: en.taskHistory.editSession,
    });

    // Wait for dialog to be visible
    await dialog.waitFor({ state: 'visible' });

    // Use the form inside this dialog
    const form = dialog.locator('form');

    if (data.start) {
      // Labels are not associated with inputs in the current implementation, so we use type selector
      // Start is the first datetime-local input
      await form
        .locator('input[type="datetime-local"]')
        .first()
        .fill(data.start);
    }

    if (data.end) {
      // End is the second datetime-local input
      await form.locator('input[type="datetime-local"]').nth(1).fill(data.end);
    }

    if (data.notes) {
      await form.locator('textarea').fill(data.notes);
    }

    await form.getByRole('button', { name: en_shared.common.save }).click();

    // Wait for dialog to disappear (close)
    await dialog.waitFor({ state: 'hidden' });
  }
}

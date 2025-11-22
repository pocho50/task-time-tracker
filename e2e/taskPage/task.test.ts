import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/tasks/i18n/locales/en.json' assert { type: 'json' };
import TaskPage from '../page-objects/taskPage';
import { TaskTestHelper, TEST_CONSTANTS } from '../helpers/taskTestHelpers';
import {
  formatDateTime,
  getDateHoursAgo,
  getDateMinutesAgo,
} from '../helpers/dateHelpers';

test.describe('task', async () => {
  let taskPage: TaskPage;
  let testHelper: TaskTestHelper;
  let testEnvironment: {
    projectId: string;
    projectName: string;
    sprintId: string;
    sprintName: string;
  };

  // Constants for this test suite
  const UPDATED_TASK_NAME = 'Updated name for e2e test';
  const TIME_TRACKING_TASK_PREFIX = 'Time Tracking Task E2E';
  const SESSION_NOTES = {
    ROW: 'Edited from row button',
    HISTORY: 'Edited from history drawer',
  };

  test.beforeEach(async ({ goto, page }) => {
    testHelper = new TaskTestHelper(page);
    testEnvironment = await testHelper.setupTestEnvironment();
    taskPage = new TaskPage(page);

    await goto(`/tasks/${testEnvironment.sprintId}`, {
      waitUntil: 'networkidle',
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up all tasks created during tests
    if (testEnvironment?.sprintId) {
      await testHelper.removeDummyTask(testEnvironment.sprintId);

      // Clean up tasks with specific names from tests
      const taskNamesToClean = [
        UPDATED_TASK_NAME,
        new RegExp(`${TIME_TRACKING_TASK_PREFIX} \\d+`),
      ];

      for (const namePattern of taskNamesToClean) {
        const tasks = await testHelper.getTasksBySprint(
          testEnvironment.sprintId
        );
        const tasksToDelete = tasks.filter((task: any) => {
          if (namePattern instanceof RegExp) {
            return namePattern.test(task.name);
          }
          return task.name === namePattern;
        });

        for (const task of tasksToDelete) {
          await page.request.delete(`/api/tasks/${task.id}`);
        }
      }
    }
  });

  test('check heading', async () => {
    await expect(taskPage.getHeading()).toHaveText(en.taskList.title);
  });

  test('check tasks list matches API data', async ({ page }) => {
    const taskCount = await testHelper.getTaskCount(testEnvironment.sprintId);
    await expect(taskPage.getTaskListItems()).toHaveCount(taskCount);
  });

  test('add new task', async ({ page }) => {
    const addButton = taskPage.getAddTaskButton();
    await expect(addButton).toBeVisible();

    // Click add task button
    await addButton.click();

    // Wait for the form to be visible
    await expect(taskPage.getFormNameInput()).toBeVisible();

    // Fill and submit the form
    await taskPage.fillForm(TEST_CONSTANTS.DUMMY_TASK);
    await taskPage.getFormSubmitButton().click();

    // Wait for the modal to close
    await expect(taskPage.getFormNameInput()).not.toBeVisible();

    // Verify the task was created in the UI
    await expect(
      taskPage.getTaskList().getByText(TEST_CONSTANTS.DUMMY_TASK.name).first()
    ).toBeVisible();

    // Verify via API that the task was created
    const taskAdded = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      TEST_CONSTANTS.DUMMY_TASK.name
    );
    expect(taskAdded).toBeTruthy();
  });

  test('edit existing task', async ({ page }) => {
    // First, create a task to edit
    const addButton = taskPage.getAddTaskButton();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(taskPage.getFormNameInput()).toBeVisible();
    await taskPage.fillForm(TEST_CONSTANTS.DUMMY_TASK);
    await taskPage.getFormSubmitButton().click();

    // Wait for the modal to close
    await expect(taskPage.getFormNameInput()).not.toBeVisible();

    // Wait for the task to be added to the UI
    await expect(
      taskPage.getTaskList().getByText(TEST_CONSTANTS.DUMMY_TASK.name).first()
    ).toBeVisible();

    // Get the created task
    const taskAdded = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      TEST_CONSTANTS.DUMMY_TASK.name
    );

    expect(taskAdded, 'Task should be created successfully').not.toBeNull();

    if (!taskAdded) return; // Guard for TypeScript

    // Click edit button
    const editButton = await taskPage.getEditTaskButton(taskAdded.id);
    await editButton.click();

    // Verify the form is populated with the task data
    const nameInput = taskPage.getFormNameInput();
    await expect(nameInput).toHaveValue(TEST_CONSTANTS.DUMMY_TASK.name);

    // Modify the task name
    await nameInput.clear();
    await nameInput.fill(UPDATED_TASK_NAME);

    // Submit the form
    await taskPage.getFormSubmitButton().click();

    // Verify the task still exists in the list with new name
    await expect(
      taskPage.getTaskList().getByText(UPDATED_TASK_NAME).first()
    ).toBeVisible();

    // Verify via API that the description was updated
    const updatedTask = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      UPDATED_TASK_NAME
    );

    expect(updatedTask, 'Task name should be updated').not.toBeNull();
    expect(updatedTask?.name).toBe(UPDATED_TASK_NAME);
  });

  test('edit session from row button and history', async ({ page }) => {
    const timestamp = Date.now();
    const taskName = `${TIME_TRACKING_TASK_PREFIX} ${timestamp}`;
    const taskData = { ...TEST_CONSTANTS.DUMMY_TASK, name: taskName };

    // Create task
    const addButton = taskPage.getAddTaskButton();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await taskPage.fillForm(taskData);
    await taskPage.getFormSubmitButton().click();

    // Verify task is visible
    await expect(taskPage.getTaskRow(taskName)).toBeVisible();

    // 1. Start a session via timer button
    await taskPage.startTaskTimer(taskName);
    await expect(taskPage.getPauseTimerButton(taskName)).toBeVisible();

    // 2. Edit the active session (change start time + notes)
    await taskPage.editActiveSession(taskName);
    const newStartDate = getDateHoursAgo(2);
    await taskPage.fillSessionForm({
      start: formatDateTime(newStartDate),
      notes: SESSION_NOTES.ROW,
    });

    // 3. Stop the session so it moves to history
    await taskPage.stopTaskTimer(taskName);
    await expect(taskPage.getStartTimerButton(taskName)).toBeVisible();

    // 4. Open history and verify the edited session is listed
    await taskPage.openTaskHistory(taskName);
    await expect(page.getByText(SESSION_NOTES.ROW)).toBeVisible();

    // 5. Edit the completed session from history (change end time + notes)
    await taskPage.editHistorySession(0);
    const newEndDate = getDateMinutesAgo(30);
    await taskPage.fillSessionForm({
      end: formatDateTime(newEndDate),
      notes: SESSION_NOTES.HISTORY,
    });

    await expect(page.getByText(SESSION_NOTES.HISTORY)).toBeVisible();

    // 6. Verify via API that the task session reflects the changes
    const taskAfterHistoryEdit = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      taskName
    );

    expect(taskAfterHistoryEdit).toBeTruthy();
    const trackAfterHistoryEdit = taskAfterHistoryEdit?.timeTracking?.find(
      (track: any) => track.notes === SESSION_NOTES.HISTORY
    );

    expect(trackAfterHistoryEdit).toBeTruthy();
    expect(trackAfterHistoryEdit?.notes).toBe(SESSION_NOTES.HISTORY);
    expect(trackAfterHistoryEdit?.start).toBeTruthy();
    expect(trackAfterHistoryEdit?.end).toBeTruthy();
  });
});

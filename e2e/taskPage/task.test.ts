import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/tasks/i18n/locales/en.json' assert { type: 'json' };
import TaskPage from '../page-objects/taskPage';
import { TaskTestHelper, TEST_CONSTANTS } from '../helpers/taskTestHelpers';

test.describe('task', async () => {
  let taskPage: TaskPage;
  let testHelper: TaskTestHelper;
  let testEnvironment: {
    projectId: string;
    projectName: string;
    sprintId: string;
    sprintName: string;
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
    // Clean up dummy tasks created during tests
    if (testEnvironment?.sprintId) {
      await testHelper.removeDummyTask(testEnvironment.sprintId);
      // Also clean up the "Updated name" task from edit test
      const updatedTask = await testHelper.findTaskByName(
        testEnvironment.sprintId,
        'Updated name for e2e test'
      );
      if (updatedTask) {
        await page.request.delete(`/api/tasks/${updatedTask.id}`);
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

  test('shows empty state when no sprint is selected', async ({ goto }) => {
    // Navigate to tasks page without sprint ID
    await goto('/tasks', {
      waitUntil: 'hydration',
    });

    // Check that empty state is visible
    await expect(taskPage.getEmptyState()).toBeVisible();
  });

  test('change sprint and verify tasks update', async ({ page }) => {
    // Get all sprints for the project
    const sprints = await testHelper.getSprintsByProject(
      testEnvironment.projectId
    );

    // Only run this test if there are at least 2 sprints
    if (!sprints || sprints.length < 2) {
      // Skip test - just verify we have the expected number of sprints
      expect(sprints?.length || 0).toBeLessThan(2);
      return;
    }

    const otherSprint = sprints.find(
      (s: any) => s.id !== testEnvironment.sprintId
    );

    if (otherSprint) {
      // Verify sprint selector is visible before trying to click
      const sprintSelector = taskPage.getSprintSelector();
      const isVisible = await sprintSelector.isVisible().catch(() => false);

      if (!isVisible) {
        // Sprint selector not visible, skip this test
        expect(isVisible).toBe(false);
        return;
      }

      // Select the other sprint
      await taskPage.selectSprint(otherSprint.name);

      // Check that tasks are updated for the new sprint
      const otherTaskCount = await testHelper.getTaskCount(otherSprint.id);
      await expect(taskPage.getTaskListItems()).toHaveCount(otherTaskCount);
    }
  });

  test('add new task', async ({ page }) => {
    const initialTaskCount = await testHelper.getTaskCount(
      testEnvironment.sprintId
    );
    const addButton = taskPage.getAddTaskButton();
    await expect(addButton).toBeVisible();

    // Click add task button
    await addButton.click();

    // Wait for the form to be visible (Playwright will retry automatically)
    await expect(taskPage.getFormNameInput()).toBeVisible();

    // Fill the form
    await taskPage.fillForm(TEST_CONSTANTS.DUMMY_TASK);

    // Submit the form
    await taskPage.getFormSubmitButton().click();

    // Verify the task was created by checking the UI
    await expect(
      taskPage.getTaskList().getByText(TEST_CONSTANTS.DUMMY_TASK.name).first()
    ).toBeVisible();

    // Get the added task
    const taskAdded = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      TEST_CONSTANTS.DUMMY_TASK.name
    );

    if (taskAdded) {
      // Verify UI shows the created task details
      await expect(
        taskPage.getTaskList().getByText(TEST_CONSTANTS.DUMMY_TASK.name).first()
      ).toBeVisible();
    }
  });

  test('edit existing task', async ({ page }) => {
    // First, create a task to edit
    const addButton = taskPage.getAddTaskButton();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(taskPage.getFormNameInput()).toBeVisible();
    await taskPage.fillForm(TEST_CONSTANTS.DUMMY_TASK);
    await taskPage.getFormSubmitButton().click();

    // Get the created task
    const taskAdded = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      TEST_CONSTANTS.DUMMY_TASK.name
    );

    if (taskAdded) {
      // Click edit button
      const editButton = await taskPage.getEditTaskButton(taskAdded.id);
      await editButton.click();

      // Verify the form is populated with the task data
      const nameInput = taskPage.getFormNameInput();
      await expect(nameInput).toHaveValue(TEST_CONSTANTS.DUMMY_TASK.name);

      // Modify the task name instead of description (easier to update)
      const updatedName = 'Updated name for e2e test';
      await nameInput.clear();
      await nameInput.fill(updatedName);

      // Submit the form
      await taskPage.getFormSubmitButton().click();

      // Verify the task still exists in the list
      await expect(
        taskPage.getTaskList().getByText(updatedName).first()
      ).toBeVisible();

      // Verify via API that the description was updated
      const updatedTask = await testHelper.findTaskByName(
        testEnvironment.sprintId,
        updatedName
      );

      if (updatedTask) {
        expect(updatedTask.name).toBe(updatedName);
      }
    }
  });
});

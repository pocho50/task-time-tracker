import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/sprints/i18n/locales/en.json' assert { type: 'json' };
import SprintPage from '../page-objects/sprintPage';
import { SprintTestHelper, TEST_CONSTANTS } from '../helpers/sprintTestHelpers';

test.describe('sprint', async () => {
  let sprintPage: SprintPage;
  let testHelper: SprintTestHelper;
  let testEnvironment: {
    projectId: string;
    projectName: string;
    projects: any[];
  };

  test.beforeEach(async ({ goto, page }) => {
    testHelper = new SprintTestHelper(page);
    testEnvironment = await testHelper.setupTestEnvironment();
    sprintPage = new SprintPage(page);
    await testHelper.removeDummySprint(testEnvironment.projectId);
    await goto(`/sprints/${testEnvironment.projectId}`, {
      waitUntil: 'hydration',
    });
  });

  test.afterEach(async ({ page }) => {
    if (testEnvironment?.projectId) {
      await testHelper.removeDummySprint(testEnvironment.projectId);
    }
  });

  test('check heading', async () => {
    await expect(sprintPage.getHeading()).toHaveText(en.sprintList.title);
  });

  test('check sprints list matches API data', async () => {
    const sprintCount = await testHelper.getSprintCount(
      testEnvironment.projectId
    );
    await expect(sprintPage.getSprintListItems()).toHaveCount(sprintCount);
  });

  test('change project and verify sprints update', async ({ page }) => {
    // Ensure we have at least two projects (already handled in setup)
    const projects = testEnvironment.projects;

    // Select a different project
    const otherProject = projects.find(
      (p: any) => p.id !== testEnvironment.projectId
    );
    if (otherProject) {
      // Select the other project
      await sprintPage.selectProject(otherProject.name);

      // Check that sprints are updated for the new project
      const otherSprintCount = await testHelper.getSprintCount(otherProject.id);
      await expect(sprintPage.getSprintListItems()).toHaveCount(
        otherSprintCount
      );
    }
  });

  test('add new sprint and remove', async ({ page }) => {
    // Click add sprint button
    await sprintPage.getAddSprintButton().click();

    // Fill the form
    await sprintPage.fillForm(TEST_CONSTANTS.DUMMY_SPRINT);

    // Submit the form
    await sprintPage.getFormSubmitButton().click();

    // Verify the sprint was added by checking it's visible in the UI
    await expect(
      sprintPage
        .getSprintList()
        .getByText(TEST_CONSTANTS.DUMMY_SPRINT.name, { exact: true })
    ).toBeVisible();

    // Get the added sprint
    const sprintAdded = await testHelper.findSprintByName(
      testEnvironment.projectId,
      TEST_CONSTANTS.DUMMY_SPRINT.name
    );

    if (sprintAdded) {
      await expect(
        sprintPage
          .getSprintList()
          .getByTestId(`sprint-actions-${sprintAdded.id}`)
      ).toBeVisible();

      // Click on the delete button
      const deleteButton = await sprintPage.getDeleteSprintButton(
        sprintAdded.id
      );
      await deleteButton.click();

      // Confirm deletion
      await sprintPage.getRemoveModalConfirmButton().click();

      // Verify UI no longer shows the sprint details
      await expect(
        sprintPage.getSprintList().getByText(TEST_CONSTANTS.DUMMY_SPRINT.name)
      ).toHaveCount(0);
      await expect(
        sprintPage
          .getSprintList()
          .getByTestId(`sprint-actions-${sprintAdded.id}`)
      ).toHaveCount(0);
    }
  });
});

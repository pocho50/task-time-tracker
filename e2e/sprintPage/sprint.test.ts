import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/sprints/i18n/locales/en.json' assert { type: 'json' };
import SprintPage from '../page-objects/sprintPage';
import { fetchApiData, removeItem, createItem } from '../helpers/api';
import type { Sprint } from '@prisma/client';
import type { Page } from '@playwright/test';
import type { SprintDataForm } from '../types/sprint';

let sprintPage: SprintPage;
const URL_API = '/api/sprints';
const URL_PROJECTS_API = '/api/projects';

// Dummy sprint data for testing
const dummySprint = {
  name: 'Test Sprint',
  startDate: '2023-01-01',
  endDate: '2023-01-14',
  status: 'ACTIVE',
} as SprintDataForm;

async function removeDummySprint(page: Page, projectId: string) {
  const sprintsFromApi = await fetchApiData<Sprint>(
    page,
    `${URL_API}/by-project?id_project=${projectId}`
  );
  if (!sprintsFromApi || !Array.isArray(sprintsFromApi)) {
    return;
  }
  const sprintToRemove = sprintsFromApi.find(
    (sprint) => sprint.name === dummySprint.name
  );
  if (sprintToRemove) {
    await removeItem(page, URL_API, sprintToRemove.id);
  }
}

async function getProjectId(page: Page) {
  const projectsFromApi = await fetchApiData<any>(page, URL_PROJECTS_API);
  return projectsFromApi && projectsFromApi.length > 0
    ? projectsFromApi[0].id
    : null;
}

async function getProjectName(page: Page, projectId: string) {
  const projectsFromApi = await fetchApiData<any>(page, URL_PROJECTS_API);
  if (!projectsFromApi || !Array.isArray(projectsFromApi)) {
    return null;
  }
  const project = projectsFromApi.find((p: any) => p.id === projectId);
  return project ? project.name : null;
}

test.describe('sprint', async () => {
  let projectId: string | null;
  let projectName: string | null;

  test.beforeEach(async ({ goto, page }) => {
    projectId = await getProjectId(page);
    if (!projectId) {
      throw new Error('No projects found in the database');
    }
    projectName = await getProjectName(page, projectId);
    if (!projectName) {
      throw new Error('Project name not found');
    }

    await goto(`/sprints/${projectId}`, { waitUntil: 'hydration' });
    sprintPage = new SprintPage(page);
    await removeDummySprint(page, projectId);
  });

  test.afterEach(async ({ page }) => {
    if (projectId) {
      await removeDummySprint(page, projectId);
    }
  });

  test('check heading', async () => {
    await expect(sprintPage.getHeading()).toHaveText(en.sprintList.title);
  });

  test('check sprints list matches API data', async ({ page }) => {
    if (!projectId) {
      throw new Error('Project ID not available');
    }
    const sprintsFromApi = await fetchApiData(
      page,
      `${URL_API}/by-project?id_project=${projectId}`
    );
    const sprintCount =
      sprintsFromApi && Array.isArray(sprintsFromApi)
        ? sprintsFromApi.length
        : 0;
    await expect(sprintPage.getSprintListItems()).toHaveCount(sprintCount);
  });

  test('change project and verify sprints update', async ({ page }) => {
    // Ensure we have at least two projects for testing
    let projectsFromApi = await fetchApiData<any>(page, URL_PROJECTS_API);

    // Handle case where API returns undefined or empty
    if (!projectsFromApi || !Array.isArray(projectsFromApi)) {
      projectsFromApi = [];
    }

    // If we don't have at least two projects, create two test projects
    if (projectsFromApi.length < 2) {
      // Create first project
      const project1Data = {
        name: 'Test Project 1',
        description: 'Description for Test Project 1',
      };
      await createItem(page, URL_PROJECTS_API, project1Data);

      // Create second project
      const project2Data = {
        name: 'Test Project 2',
        description: 'Description for Test Project 2',
      };
      await createItem(page, URL_PROJECTS_API, project2Data);

      // Refresh projects list
      projectsFromApi = await fetchApiData<any>(page, URL_PROJECTS_API);
    }

    // Get initial sprints count
    const initialSprints = await fetchApiData(
      page,
      `${URL_API}/by-project?id_project=${projectId}`
    );

    // Select a different project
    const otherProject =
      projectsFromApi && Array.isArray(projectsFromApi)
        ? projectsFromApi.find((p: any) => p.id !== projectId)
        : null;
    if (otherProject) {
      // Select the other project
      await sprintPage.selectProject(otherProject.name);

      // Wait for the page to update
      await page.waitForTimeout(1000);

      // Check that sprints are updated for the new project
      const otherProjectSprints = await fetchApiData(
        page,
        `${URL_API}/by-project?id_project=${otherProject.id}`
      );
      const otherSprintCount =
        otherProjectSprints && Array.isArray(otherProjectSprints)
          ? otherProjectSprints.length
          : 0;
      await expect(sprintPage.getSprintListItems()).toHaveCount(
        otherSprintCount
      );
    }
  });

  test('add new sprint and remove', async ({ page }) => {
    if (!projectId) {
      throw new Error('Project ID not available');
    }

    const sprintsFromApi = await fetchApiData(
      page,
      `${URL_API}/by-project?id_project=${projectId}`
    );

    // Click add sprint button
    await sprintPage.getAddSprintButton().click();

    // Fill form
    await sprintPage.fillForm(dummySprint);

    // Submit form
    await sprintPage.getFormSubmitButton().click();

    // Check sprint is added
    await expect(sprintPage.getSprintListItems()).toHaveCount(
      sprintsFromApi.length + 1
    );

    // Get the added sprint
    const sprintsAfterAdd = await fetchApiData<Sprint>(
      page,
      `${URL_API}/by-project?id_project=${projectId}`
    );
    const sprintAdded = sprintsAfterAdd.find(
      (sprint) => sprint.name === dummySprint.name
    );
    expect(sprintAdded).toBeTruthy();

    // Delete sprint
    if (sprintAdded) {
      await (await sprintPage.getDeleteSprintButton(sprintAdded.id)).click();

      // Check remove modal is open
      await expect(sprintPage.getRemoveModal()).toBeVisible();

      // Confirm remove
      await sprintPage.getRemoveModalConfirmButton().click();

      // Check sprint is deleted
      await expect(sprintPage.getSprintListItems()).toHaveCount(
        sprintsFromApi.length
      );
    }
  });
});


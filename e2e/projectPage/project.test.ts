import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/projects/i18n/locales/en.json' assert { type: 'json' };
import ProjectPage from '../page-objects/projectPage';

let projectPage: ProjectPage;
const URL_API = '/api/projects';

test.describe('project', async () => {
  test.beforeEach(async ({ goto, page }) => {
    await goto('/projects', { waitUntil: 'hydration' });
    projectPage = new ProjectPage(page);
  });
  test('check heading', async () => {
    await expect(projectPage.getHeading()).toHaveText(en.title);
  });

  test('check projects list matches API data', async ({ page }) => {
    // Now fetch the API data directly to compare with what's rendered
    const apiResponse = await page.request.get(URL_API);
    const apiData = await apiResponse.json();
    const projectsFromApi = apiData.data;

    // Verify that the UI matches the API data
    await expect(projectPage.getProjectsListItems()).toHaveCount(
      projectsFromApi.length
    );
  });
});

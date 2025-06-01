import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/projects/i18n/locales/en.json' assert { type: 'json' };
import ProjectPage from '../page-objects/projectPage';
import { fetchApiData } from '../helpers/api';

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
    const projectsFromApi = await fetchApiData(page, URL_API);
    await expect(projectPage.getProjectsListItems()).toHaveCount(
      projectsFromApi.length
    );
  });
});

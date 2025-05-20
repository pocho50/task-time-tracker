import { expect, test } from '@nuxt/test-utils/playwright';
import en from '#layers/projects/i18n/locales/en.json' assert { type: 'json' };

test.describe('project', async () => {
  test('check heading', async ({ page, goto }) => {
    await goto('/projects', { waitUntil: 'hydration' });
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(en.title);
  });

  test('check projects list matches API data', async ({ page, goto }) => {
    await goto('/projects', { waitUntil: 'hydration' });

    // Wait for the projects list to be visible
    await page.waitForSelector('[data-testid="project-list"]');

    // Now fetch the API data directly to compare with what's rendered
    const apiResponse = await page.request.get('/api/projects');
    const apiData = await apiResponse.json();
    const projectsFromApi = apiData.data;

    // Verify that the UI matches the API data
    await expect(
      page.getByTestId('project-list').getByRole('article')
    ).toHaveCount(projectsFromApi.length);
  });
});

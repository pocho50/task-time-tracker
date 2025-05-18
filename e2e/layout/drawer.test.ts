import { expect, test } from '@nuxt/test-utils/playwright';
import LayoutPage from '../page-objects/layoutPage';

test.describe('menu drawer', async () => {
  test('exist drawer buttons', async ({ page, goto }) => {
    const layoutPage = new LayoutPage(page);
    await goto('/projects', { waitUntil: 'hydration' });

    // in desktop mode
    await expect(layoutPage.getDesktopToggleDrawerButton()).toBeVisible();
    await expect(layoutPage.getMobileToggleDrawerButton()).not.toBeVisible();

    // in mobile mode
    await page.setViewportSize({ width: 425, height: 768 });
    await expect(layoutPage.getMobileToggleDrawerButton()).toBeVisible();
    await expect(layoutPage.getDesktopToggleDrawerButton()).not.toBeVisible();
  });
  test('check aside close and open', async ({ page, goto }) => {
    const layoutPage = new LayoutPage(page);
    await goto('/projects', { waitUntil: 'hydration' });

    // check aside is open
    await expect(layoutPage.getAside()).toBeVisible();

    // click toggle drawer button
    await layoutPage.getDesktopToggleDrawerButton().click();
    // check aside is closed
    await expect(layoutPage.getAside()).toBeHidden();

    // in mobile mode
    await page.setViewportSize({ width: 425, height: 768 });

    // check aside is closed
    await expect(layoutPage.getAside()).toBeHidden();

    // click toggle drawer button
    await layoutPage.getMobileToggleDrawerButton().click();

    // check aside is open
    await expect(layoutPage.getAside()).toBeVisible();
  });
});

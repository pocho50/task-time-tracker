import { expect, test } from '@nuxt/test-utils/playwright';
import { TITLE } from '../../utils/constants';

test('test', async ({ page, goto }) => {
  await goto('/login', { waitUntil: 'hydration' });
  await expect(page.getByRole('heading')).toHaveText(TITLE);
});

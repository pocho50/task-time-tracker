import { type Page } from '@playwright/test';

export async function fetchApiData<T>(page: Page, url: string): Promise<T[]> {
  const apiResponse = await page.request.get(url);
  const apiData = await apiResponse.json();
  return apiData.data;
}

export async function removeItem(page: Page, url: string, id: string) {
  await page.request.delete(`${url}/${id}`);
}

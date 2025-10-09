import type { Page } from '@playwright/test';
import { fetchApiData } from './api';
import { SHARED_TEST_URLS } from './testConstants';

/**
 * Base test helper class with common functionality for E2E tests
 */
export abstract class BaseTestHelper {
  constructor(protected page: Page) {}

  // Project management - identical methods only
  async getProjects() {
    return await fetchApiData<any>(this.page, SHARED_TEST_URLS.PROJECTS_API);
  }

  async getFirstProject() {
    const projects = await this.getProjects();
    return projects && projects.length > 0 ? projects[0] : null;
  }

  // Sprint management - identical methods only
  async getSprintsByProject(projectId: string) {
    return await fetchApiData<any>(
      this.page,
      `${SHARED_TEST_URLS.SPRINTS_API}/by-project?id_project=${projectId}`
    );
  }

  async getSprintCount(projectId: string) {
    const sprints = await this.getSprintsByProject(projectId);
    return sprints && Array.isArray(sprints) ? sprints.length : 0;
  }
}

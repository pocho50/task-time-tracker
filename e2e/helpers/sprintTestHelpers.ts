import type { Page } from '@playwright/test';
import type { Sprint } from '@prisma/client';
import { fetchApiData, removeItem, createItem } from './api';
import type { SprintDataForm } from '../types/sprint';

// Test constants
export const TEST_CONSTANTS = {
  URLS: {
    SPRINTS_API: '/api/sprints',
    PROJECTS_API: '/api/projects',
  },
  DUMMY_SPRINT: {
    name: 'Test Sprint',
    startDate: '2023-01-01',
    endDate: '2023-01-14',
    status: 'ACTIVE',
  } as SprintDataForm,
  TEST_PROJECTS: [
    {
      name: 'Test Project 1',
      description: 'Description for Test Project 1',
    },
    {
      name: 'Test Project 2', 
      description: 'Description for Test Project 2',
    },
  ],
};

export class SprintTestHelper {
  constructor(private page: Page) {}

  // Project management
  async getProjects() {
    return await fetchApiData<any>(this.page, TEST_CONSTANTS.URLS.PROJECTS_API);
  }

  async getFirstProject() {
    const projects = await this.getProjects();
    return projects && projects.length > 0 ? projects[0] : null;
  }

  async findProjectById(projectId: string) {
    const projects = await this.getProjects();
    if (!projects || !Array.isArray(projects)) return null;
    return projects.find((p: any) => p.id === projectId) || null;
  }

  async ensureTwoProjectsExist() {
    let projects = await this.getProjects();
    
    if (!projects || !Array.isArray(projects)) {
      projects = [];
    }

    // Create projects if we don't have at least 2
    if (projects.length < 2) {
      for (const projectData of TEST_CONSTANTS.TEST_PROJECTS) {
        await createItem(this.page, TEST_CONSTANTS.URLS.PROJECTS_API, projectData);
      }
      projects = await this.getProjects();
    }
    
    return projects;
  }

  // Sprint management
  async getSprintsByProject(projectId: string) {
    return await fetchApiData<Sprint>(
      this.page,
      `${TEST_CONSTANTS.URLS.SPRINTS_API}/by-project?id_project=${projectId}`
    );
  }

  async findSprintByName(projectId: string, sprintName: string) {
    const sprints = await this.getSprintsByProject(projectId);
    if (!sprints || !Array.isArray(sprints)) return null;
    return sprints.find((sprint) => sprint.name === sprintName) || null;
  }

  async removeDummySprint(projectId: string) {
    const sprint = await this.findSprintByName(projectId, TEST_CONSTANTS.DUMMY_SPRINT.name);
    if (sprint) {
      await removeItem(this.page, TEST_CONSTANTS.URLS.SPRINTS_API, sprint.id);
    }
  }

  async getSprintCount(projectId: string) {
    const sprints = await this.getSprintsByProject(projectId);
    return sprints && Array.isArray(sprints) ? sprints.length : 0;
  }

  // Test setup helpers
  async setupTestEnvironment() {
    const projects = await this.ensureTwoProjectsExist();
    const firstProject = projects[0];
    
    if (!firstProject) {
      throw new Error('Failed to setup test environment: No projects available');
    }

    return {
      projectId: firstProject.id,
      projectName: firstProject.name,
      projects,
    };
  }
}

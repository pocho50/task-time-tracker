import type { Page } from '@playwright/test';
import type { Task } from '@prisma/client';
import { fetchApiData, removeItem, createItem } from './api';
import type { TaskDataForm } from '../types/task';

// Test constants
export const TEST_CONSTANTS = {
  URLS: {
    TASKS_API: '/api/tasks',
    SPRINTS_API: '/api/sprints',
    PROJECTS_API: '/api/projects',
  },
  DUMMY_TASK: {
    name: 'Test Task E2E',
    description: 'This is a test task for e2e testing',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    estimatedHours: 5,
  } as TaskDataForm,
  TEST_PROJECTS: [
    {
      name: 'Test Project for Tasks',
      description: 'Description for Test Project',
    },
  ],
  TEST_SPRINT: {
    name: 'Test Sprint for Tasks',
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    status: 'ACTIVE',
  },
};

export class TaskTestHelper {
  constructor(private page: Page) {}

  // Project management
  async getProjects() {
    return await fetchApiData<any>(this.page, TEST_CONSTANTS.URLS.PROJECTS_API);
  }

  async getFirstProject() {
    const projects = await this.getProjects();
    return projects && projects.length > 0 ? projects[0] : null;
  }

  async ensureProjectExists() {
    // Check if a project already exists
    const existingProject = await this.getFirstProject();
    
    if (existingProject) {
      return existingProject;
    }

    // If no project exists, create a new one
    const baseProjectData = TEST_CONSTANTS.TEST_PROJECTS[0];

    if (!baseProjectData) {
      throw new Error('No test project data available');
    }

    const projectData = {
      ...baseProjectData,
      name: `${baseProjectData.name} ${Date.now()}`, // Make it unique
    };

    const createdProject = await createItem(
      this.page,
      `${TEST_CONSTANTS.URLS.PROJECTS_API}/save`,
      projectData
    );

    return createdProject;
  }

  // Sprint management
  async getSprintsByProject(projectId: string) {
    return await fetchApiData<any>(
      this.page,
      `${TEST_CONSTANTS.URLS.SPRINTS_API}/by-project?id_project=${projectId}`
    );
  }

  async getFirstSprintForProject(projectId: string) {
    const sprints = await this.getSprintsByProject(projectId);
    return sprints && sprints.length > 0 ? sprints[0] : null;
  }

  async ensureSprintExists(projectId: string) {
    // Check if a sprint already exists for this project
    const existingSprint = await this.getFirstSprintForProject(projectId);
    
    if (existingSprint) {
      return existingSprint;
    }

    // If no sprint exists, create a new one
    const sprintData = {
      ...TEST_CONSTANTS.TEST_SPRINT,
      name: `${TEST_CONSTANTS.TEST_SPRINT.name} ${Date.now()}`, // Make it unique
      projectId,
    };
    const createdSprint = await createItem(
      this.page,
      `${TEST_CONSTANTS.URLS.SPRINTS_API}/save`,
      sprintData
    );
    return createdSprint;
  }

  // Task management
  async getTasksBySprint(sprintId: string) {
    const response = await this.page.request.get(
      `${TEST_CONSTANTS.URLS.TASKS_API}/by-sprint?sprintId=${sprintId}&pageSize=999`
    );
    const data = await response.json();
    // The API returns { data: [...], pagination: {...} }
    return data.data || [];
  }

  async findTaskByName(sprintId: string, taskName: string) {
    const tasks = await this.getTasksBySprint(sprintId);
    if (!tasks || !Array.isArray(tasks)) return null;
    return tasks.find((task) => task.name === taskName) || null;
  }

  async removeDummyTask(sprintId: string) {
    const task = await this.findTaskByName(
      sprintId,
      TEST_CONSTANTS.DUMMY_TASK.name
    );
    if (task) {
      await removeItem(this.page, TEST_CONSTANTS.URLS.TASKS_API, task.id);
    }
  }

  async createDummyTask(
    projectId: string,
    sprintId: string,
    taskData: TaskDataForm
  ) {
    return await createItem(
      this.page,
      `${TEST_CONSTANTS.URLS.TASKS_API}/save`,
      { ...taskData, projectId, sprintId }
    );
  }

  async removeTasksByNames(sprintId: string, taskNames: string[]) {
    for (const taskName of taskNames) {
      const task = await this.findTaskByName(sprintId, taskName);
      if (task) {
        await removeItem(this.page, TEST_CONSTANTS.URLS.TASKS_API, task.id);
      }
    }
  }

  async getTaskCount(sprintId: string) {
    const tasks = await this.getTasksBySprint(sprintId);
    return tasks && Array.isArray(tasks) ? tasks.length : 0;
  }

  async cleanupSprint(sprintId: string) {
    try {
      await this.page.request.delete(
        `${TEST_CONSTANTS.URLS.SPRINTS_API}/${sprintId}`
      );
    } catch (error) {
      console.log('Failed to cleanup sprint:', error);
    }
  }

  // Test setup helpers
  async setupTestEnvironment() {
    const project = await this.ensureProjectExists();

    if (!project) {
      throw new Error(
        'Failed to setup test environment: No projects available'
      );
    }

    const sprint = await this.ensureSprintExists(project.id);

    if (!sprint) {
      throw new Error('Failed to setup test environment: No sprints available');
    }

    return {
      projectId: project.id,
      projectName: project.name,
      sprintId: sprint.id,
      sprintName: sprint.name,
    };
  }
}

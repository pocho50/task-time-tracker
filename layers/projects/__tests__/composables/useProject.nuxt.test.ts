import { describe, it, expect, vi } from 'vitest';
import { useProjects } from '../../composables/useProjects';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mockProjects } from '../__mocks__/projectMocks';

// Create mock methods using vi.hoisted to avoid hoisting issues
const mockProjectsRepo = vi.hoisted(() => ({
  setParams: vi.fn(),
  getAll: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
}));

// Mock ProjectsRepo with static keys property
vi.mock('#layers/projects/repository/projectRepo', () => {
  class MockProjectsRepo {
    static keys = {
      allProjects: 'all-projects',
      projects: 'projects',
    };

    setParams = mockProjectsRepo.setParams;
    getAll = mockProjectsRepo.getAll;
    save = mockProjectsRepo.save;
    delete = mockProjectsRepo.delete;
  }

  return {
    ProjectsRepo: MockProjectsRepo,
  };
});

const page = ref(1);

// Mock Nuxt imports
mockNuxtImport('useNuxtApp', () => {
  return () => ({ $api: {} });
});

mockNuxtImport('useRouteQuery', () => {
  return () => page;
});

mockNuxtImport('useAsyncData', () => {
  return (cb: any) => ({
    data: ref({
      data: mockProjects,
      pagination: { page: 1, pageCount: 3 },
    }),
    refresh: vi.fn(),
  });
});

describe('useProjects', () => {
  it('should return projects from repository', () => {
    // Act
    const { projects } = useProjects();

    // Assert
    expect(projects.value).toHaveLength(2);
    expect(projects.value[0]?.name).toMatchInlineSnapshot(`"Project 1"`);
  });

  it('should call save on repository when handleSave is called', async () => {
    // Arrange
    const projectData = {
      name: 'New Project',
      description: 'New Project Description',
    };
    mockProjectsRepo.save.mockResolvedValue({});

    // Act
    const { handleSave, openDrawer } = useProjects();
    await handleSave(projectData);

    // Assert
    expect(mockProjectsRepo.save).toHaveBeenCalledWith(projectData);
    expect(openDrawer.value).toBe(false);
  });

  it('should update selectedProject when handleEdit is called', () => {
    // Act
    const { handleEdit, selectedProject, openDrawer } = useProjects();
    handleEdit('1');

    // Assert
    expect(selectedProject.value).toMatchInlineSnapshot(`
      {
        "description": "Description for project 1",
        "id": "1",
        "name": "Project 1",
      }
    `);
    expect(openDrawer.value).toBe(true);
  });

  it('should call delete on repository when handleRemove is called', async () => {
    // Arrange
    mockProjectsRepo.delete.mockResolvedValue({});

    // Act
    const { handleRemove } = useProjects();
    await handleRemove('1');

    // Assert
    expect(mockProjectsRepo.delete).toHaveBeenCalledWith('1');
  });
});

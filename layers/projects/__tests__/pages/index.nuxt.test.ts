import { describe, it, expect, vi } from 'vitest';
import {
  mockNuxtImport,
  mockComponent,
  mountSuspended,
} from '@nuxt/test-utils/runtime';
import ProjectsIndexPage from '../../pages/projects/index.vue';
import { mockProjects } from '../__mocks__/projectMocks';

// Create shared mock for user permissions
const userAllowedMock = vi.fn().mockReturnValue(true);

mockNuxtImport('useUser', () => {
  return () => ({
    userIsAllowedToWrite: userAllowedMock,
  });
});

// Mock composables
mockNuxtImport('useProjects', () => {
  return () => ({
    projects: ref(mockProjects),
    pagination: ref({
      page: 1,
      pageCount: 3,
      total: 25,
    }),
    page: ref(1),
    openDrawer: ref(false),
    selectedProject: ref(null),
    handleEdit: vi.fn(),
    handleAdd: vi.fn(),
    handleSave: vi.fn(),
    handleRemove: vi.fn(),
  });
});

mockNuxtImport('useTemplateRef', () => {
  return () => ref(null);
});

// Mock components
mockComponent('AppTitle', {
  props: { text: String },
  template: '<div data-testid="app-title">{{ text }}</div>',
});

mockComponent('ProjectList', {
  props: ['projects', 'onEdit', 'onRemove'],
  template: '<div data-testid="project-list">{{ projects.length }}</div>',
});

mockComponent('AppAddBtn', {
  template: '<button data-testid="add-button"></button>',
});

describe('ProjectsIndexPage', () => {
  it('should render projects list when projects are available', async () => {
    // Act
    const wrapper = await mountSuspended(ProjectsIndexPage);

    // Assert
    expect(wrapper.find('[data-testid="project-list"]').exists()).toBe(true);
  });

  it('should render empty state when no projects are available', async () => {
    // Arrange
    mockNuxtImport('useProjects', () => {
      return () => ({
        projects: ref([]),
        pagination: ref(null),
        page: ref(1),
        openDrawer: ref(false),
        selectedProject: ref(null),
        handleEdit: vi.fn(),
        handleAdd: vi.fn(),
        handleSave: vi.fn(),
        handleRemove: vi.fn(),
      });
    });

    // Act
    const wrapper = await mountSuspended(ProjectsIndexPage);

    // Assert
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
  });

  it('should show add button when user has permission', async () => {
    userAllowedMock.mockReturnValue(true);

    // Act
    const wrapper = await mountSuspended(ProjectsIndexPage);

    // Assert
    expect(wrapper.find('[data-testid="add-button"]').exists()).toBe(true);
  });

  it('should not show add button when user has no permission', async () => {
    userAllowedMock.mockReturnValue(false);

    // Act
    const wrapper = await mountSuspended(ProjectsIndexPage);

    // Assert
    expect(wrapper.find('[data-testid="add-button"]').exists()).toBe(false);
  });
});

import { describe, it, expect, vi } from 'vitest';
import {
  mockNuxtImport,
  mockComponent,
  mountSuspended,
} from '@nuxt/test-utils/runtime';
import ProjectList from '../../components/ProjectList.vue';
import { mockProjects } from '../__mocks__/projectMocks';

// Create shared mock for user permissions
const userAllowedMock = vi.fn().mockReturnValue(true);

// Create shared mocks for context handlers
const handleEditMock = vi.fn();
const handleRemoveMock = vi.fn();

mockNuxtImport('useUser', () => {
  return () => ({
    userIsAllowedToWrite: userAllowedMock,
    userIsAllowedToDelete: userAllowedMock,
  });
});

mockNuxtImport('useProjectsContext', () => {
  return () => ({
    handleEdit: handleEditMock,
    handleRemove: handleRemoveMock,
  });
});

mockComponent('AppOptionAction', {
  props: ['actions'],
  template: '<div class="mock-card-actions"><slot></slot></div>',
  emits: ['edit', 'remove'],
});

mockComponent('Icon', {
  props: ['name', 'size'],
  template: '<i :data-icon="name" :class="`icon-${name}`"></i>',
});

describe('ProjectList', () => {
  it('renders the correct number of project cards', async () => {
    // Act
    const wrapper = await mountSuspended(ProjectList, {
      props: {
        projects: mockProjects,
      },
    });

    // Assert
    const cards = wrapper.findAll('.card');
    expect(cards.length).toBe(2);

    expect(wrapper.text()).toContain('Project 1');
    expect(wrapper.text()).toContain('Project 2');
  });

  it('hides edit and remove buttons when user does not have permissions', async () => {
    // Arrange
    userAllowedMock.mockReturnValue(false);

    // Act
    const wrapper = await mountSuspended(ProjectList, {
      props: {
        projects: mockProjects,
      },
    });

    // Assert
    expect(wrapper.findComponent({ name: 'AppOptionAction' }).exists()).toBe(
      false
    );
  });

  it('does not render anything when project list is empty', async () => {
    // Act
    const wrapper = await mountSuspended(ProjectList, {
      props: {
        projects: [],
      },
    });

    // Assert
    expect(wrapper.find('.card').exists()).toBe(false);
  });
});

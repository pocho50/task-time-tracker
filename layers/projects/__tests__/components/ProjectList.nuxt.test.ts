import { describe, it, expect, vi } from 'vitest';
import { mockNuxtImport, mockComponent } from '@nuxt/test-utils/runtime';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ProjectList from '../../components/ProjectList.vue';
import { mockProjects } from '../__mocks__/projectMocks';

// Create shared mock for user permissions
const userAllowedMock = vi.fn().mockReturnValue(true);

mockNuxtImport('useUser', () => {
  return () => ({
    userIsAllowedToWrite: userAllowedMock,
  });
});

mockComponent('AppCardAction', {
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
    // Arrange
    const onEditMock = vi.fn();
    const onRemoveMock = vi.fn();

    // Act
    const wrapper = await mountSuspended(ProjectList, {
      props: {
        projects: mockProjects,
        onEdit: onEditMock,
        onRemove: onRemoveMock,
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
        onEdit: vi.fn(),
        onRemove: vi.fn(),
      },
    });

    // Assert
    expect(wrapper.findComponent({ name: 'AppCardAction' }).exists()).toBe(
      false
    );
  });

  it('does not render anything when project list is empty', async () => {
    // Act
    const wrapper = await mountSuspended(ProjectList, {
      props: {
        projects: [],
        onEdit: vi.fn(),
        onRemove: vi.fn(),
      },
    });

    // Assert
    expect(wrapper.find('.card').exists()).toBe(false);
  });
});

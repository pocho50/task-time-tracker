import { describe, it, expect, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { mockComponent, mockNuxtImport } from '@nuxt/test-utils/runtime';
import ProjectSelector from '../../components/ProjectSelector.vue';
import { mockProjects } from '@/layers/projects/__tests__/__mocks__/projectMocks';

// Mock the useProjectsForSelector composable
const { useProjectsForSelectorMock } = vi.hoisted(() => {
  return {
    useProjectsForSelectorMock: vi.fn(() => ({
      projects: mockProjects,
    })),
  };
});

mockNuxtImport('useProjectsForSelector', () => useProjectsForSelectorMock);

// Mock the Icon component
mockComponent('Icon', {
  props: ['name', 'size'],
  template: '<i :data-icon="name" :class="`icon-${name}`"></i>',
});

describe('ProjectSelector', () => {
  it('renders with default label and placeholder', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(ProjectSelector);

    // Assert
    expect(wrapper.find('.label-text').text()).toBe('Select Project');
    expect(wrapper.find('select option[disabled]').text()).toBe(
      'Select Project'
    );
  });

  it('renders with custom label and placeholder when provided', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(ProjectSelector, {
      props: {
        label: 'Choose Project',
        placeholder: 'Pick a project',
      },
    });

    // Assert
    expect(wrapper.find('.label-text').text()).toBe('Choose Project');
    expect(wrapper.find('select option[disabled]').text()).toBe(
      'Pick a project'
    );
  });

  it('displays all projects from useProjectsForSelector', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(ProjectSelector);

    // Assert
    const options = wrapper.findAll('select option:not([disabled])');
    expect(options.length).toBe(mockProjects.length);
    expect(options[0].text()).toBe(mockProjects[0].name);
    expect(options[1].text()).toBe(mockProjects[1].name);
    expect(options[0].attributes('value')).toBe(mockProjects[0].id);
    expect(options[1].attributes('value')).toBe(mockProjects[1].id);
  });

  it('sets the correct project as selected based on v-model', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(ProjectSelector, {
      props: {
        modelValue: '2',
      },
    });

    // Assert
    const select = wrapper.find('select').element as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  it('emits change event when a project is selected', async () => {
    // Arrange
    const wrapper = await mountSuspended(ProjectSelector);

    // Act
    const select = wrapper.find('select');
    await select.setValue(mockProjects[1].id);

    // Assert
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')![0]).toEqual([mockProjects[1].id]);
  });

  it('updates v-model when selection changes', async () => {
    // Arrange
    const wrapper = await mountSuspended(ProjectSelector);

    // Act
    const select = wrapper.find('select');
    await select.setValue(mockProjects[0].id);

    // Assert
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([
      mockProjects[0].id,
    ]);
  });

  it('applies disabled state correctly', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(ProjectSelector, {
      props: {
        disabled: true,
      },
    });

    // Assert
    const select = wrapper.find('select');
    expect(select.attributes('disabled')).toBeDefined();
  });

  it('applies custom class to form control', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(ProjectSelector, {
      props: {
        class: 'custom-class w-64',
      },
    });

    // Assert
    const formControl = wrapper.find('.form-control');
    expect(formControl.classes()).toContain('custom-class');
    expect(formControl.classes()).toContain('w-64');
  });

  it('handles empty projects list gracefully', async () => {
    // Arrange
    useProjectsForSelectorMock.mockReturnValueOnce({
      projects: [],
    });

    // Act
    const wrapper = await mountSuspended(ProjectSelector);

    // Assert
    const options = wrapper.findAll('select option:not([disabled])');
    expect(options.length).toBe(0);
  });

  it('handles single project in list', async () => {
    // Arrange
    useProjectsForSelectorMock.mockReturnValueOnce({
      projects: mockProjects.slice(0, 1),
    });

    // Act
    const wrapper = await mountSuspended(ProjectSelector);

    // Assert
    const options = wrapper.findAll('select option:not([disabled])');
    expect(options.length).toBe(1);
    expect(options[0].text()).toBe(mockProjects.slice(0, 1)[0].name);
    expect(options[0].attributes('value')).toBe(mockProjects.slice(0, 1)[0].id);
  });

  it('maintains proper HTML structure', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(ProjectSelector);

    // Assert
    expect(wrapper.find('.form-control').exists()).toBe(true);
    expect(wrapper.find('.label').exists()).toBe(true);
    expect(wrapper.find('.label-text').exists()).toBe(true);
    expect(wrapper.find('select.select-bordered').exists()).toBe(true);
    expect(wrapper.find('select option[disabled]').exists()).toBe(true);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { mockComponent, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import SprintList from '../../components/SprintList.vue';
import { mockSprints } from '../__mocks__/sprintMocks';

// Create shared mocks for context handlers
const handleEditMock = vi.fn();
const handleRemoveMock = vi.fn();

mockNuxtImport('useSprintsContext', () => {
  return () => ({
    handleEdit: handleEditMock,
    handleRemove: handleRemoveMock,
  });
});

mockComponent('AppOptionAction', {
  props: ['actions'],
  template: '<div class="mock-option-action"><slot></slot></div>',
  emits: ['edit', 'remove'],
});

describe('SprintList', () => {
  it('renders the correct number of sprint rows', async () => {
    // Act
    const wrapper = await mountSuspended(SprintList, {
      props: {
        sprints: mockSprints,
      },
    });

    // Assert
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(2);

    expect(wrapper.text()).toContain('Sprint 1');
    expect(wrapper.text()).toContain('Sprint 2');
    expect(wrapper.text()).toContain('ACTIVE');
    expect(wrapper.text()).toContain('PLANNING');
  });

  it('renders empty table when sprint list is empty', async () => {
    // Act
    const wrapper = await mountSuspended(SprintList, {
      props: {
        sprints: [],
      },
    });

    // Assert
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(0);

    // Table structure should still exist
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('thead').exists()).toBe(true);
    expect(wrapper.find('tbody').exists()).toBe(true);
  });

  it('displays formatted dates correctly', async () => {
    // Act
    const wrapper = await mountSuspended(SprintList, {
      props: {
        sprints: mockSprints,
      },
    });

    // Assert
    // The formatDate mock should format the dates
    expect(
      wrapper.get('tbody tr td:nth-child(2)').text()
    ).toMatchInlineSnapshot(`"2/1/2024"`);
    expect(
      wrapper.get('tbody tr td:nth-child(3)').text()
    ).toMatchInlineSnapshot(`"15/1/2024"`);
  });

  it('displays sprint status badges', async () => {
    // Act
    const wrapper = await mountSuspended(SprintList, {
      props: {
        sprints: mockSprints,
      },
    });

    // Assert
    const badges = wrapper.findAll('.badge');
    expect(badges.length).toBe(2);
    expect(
      wrapper.get('tbody tr td:nth-child(4)').text()
    ).toMatchInlineSnapshot(`"ACTIVE"`);
    expect(
      wrapper.get('tbody tr:nth-child(2) td:nth-child(4)').text()
    ).toMatchInlineSnapshot(`"PLANNING"`);
  });
});

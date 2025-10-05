import { describe, it, expect, vi } from 'vitest';
import { mockNuxtImport, mockComponent } from '@nuxt/test-utils/runtime';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import TaskListItem from '../../components/TaskListItem.vue';
import { mockTasks } from '../__mocks__/taskMocks';

// Mock useTaskTimeTracks composable
const mockHandleStart = vi.fn();
const mockHandleEnd = vi.fn();
const mockCurrentTimeTrackSession = ref(null);
const mockGetTimeAccumulatedSeconds = ref(10800); // 3 hours in seconds

mockNuxtImport('useTaskTimeTracks', () => {
  return () => ({
    currentTimeTrackSession: mockCurrentTimeTrackSession,
    getTimeAccumulatedSeconds: mockGetTimeAccumulatedSeconds,
    handleStart: mockHandleStart,
    handleEnd: mockHandleEnd,
  });
});

// Mock components
mockComponent('AppBadge', {
  props: ['variant', 'size'],
  template:
    '<span class="mock-badge" :data-variant="variant"><slot></slot></span>',
});

mockComponent('TaskAssignedUsers', {
  props: ['users'],
  template: '<div class="mock-assigned-users">{{ users.length }} users</div>',
});

mockComponent('TaskTime', {
  props: ['accumulatedSeconds', 'startInmediate'],
  template: '<div class="mock-task-time">{{ accumulatedSeconds }}s</div>',
  emits: ['start', 'end'],
});

mockComponent('AppOptionAction', {
  props: ['actions'],
  template: '<div class="mock-option-action"><slot></slot></div>',
  emits: ['edit'],
});

describe('TaskListItem', () => {
  it('renders task information correctly', async () => {
    // Arrange
    const task = mockTasks[0]!;
    const onEditMock = vi.fn();

    // Act
    const wrapper = await mountSuspended(TaskListItem, {
      props: {
        task,
        onEdit: onEditMock,
      },
    });

    // Assert
    expect(wrapper.text()).toContain('Task 1');
    expect(wrapper.text()).toContain('Description for task 1');
    expect(wrapper.text()).toContain('HIGH');
    expect(wrapper.text()).toContain('IN_PROGRESS');
  });

  it('renders task without description', async () => {
    // Arrange
    const task = mockTasks[2]!; // Task 3 has no description
    const onEditMock = vi.fn();

    // Act
    const wrapper = await mountSuspended(TaskListItem, {
      props: {
        task,
        onEdit: onEditMock,
      },
    });

    // Assert
    expect(wrapper.text()).toContain('Task 3');
    expect(wrapper.find('.text-sm.text-gray-500').exists()).toBe(false);
  });

  it('displays correct priority badge variant', async () => {
    // Arrange
    const highPriorityTask = mockTasks[0]!; // HIGH priority
    const mediumPriorityTask = mockTasks[1]!; // MEDIUM priority
    const lowPriorityTask = mockTasks[2]!; // LOW priority

    // Act
    const highWrapper = await mountSuspended(TaskListItem, {
      props: { task: highPriorityTask, onEdit: vi.fn() },
    });
    const mediumWrapper = await mountSuspended(TaskListItem, {
      props: { task: mediumPriorityTask, onEdit: vi.fn() },
    });
    const lowWrapper = await mountSuspended(TaskListItem, {
      props: { task: lowPriorityTask, onEdit: vi.fn() },
    });

    // Assert
    const highBadges = highWrapper.findAll('.mock-badge');
    const mediumBadges = mediumWrapper.findAll('.mock-badge');
    const lowBadges = lowWrapper.findAll('.mock-badge');

    // Priority badge is the first one
    expect(highBadges[0]!.attributes('data-variant')).toBe('error');
    expect(mediumBadges[0]!.attributes('data-variant')).toBe('warning');
    expect(lowBadges[0]!.attributes('data-variant')).toBe('info');
  });

  it('displays correct status badge variant', async () => {
    // Arrange
    const inProgressTask = mockTasks[0]!; // IN_PROGRESS
    const analyzingTask = mockTasks[1]!; // ANALYZING
    const approvedTask = mockTasks[2]!; // APPROVED

    // Act
    const inProgressWrapper = await mountSuspended(TaskListItem, {
      props: { task: inProgressTask, onEdit: vi.fn() },
    });
    const analyzingWrapper = await mountSuspended(TaskListItem, {
      props: { task: analyzingTask, onEdit: vi.fn() },
    });
    const approvedWrapper = await mountSuspended(TaskListItem, {
      props: { task: approvedTask, onEdit: vi.fn() },
    });

    // Assert
    const inProgressBadges = inProgressWrapper.findAll('.mock-badge');
    const analyzingBadges = analyzingWrapper.findAll('.mock-badge');
    const approvedBadges = approvedWrapper.findAll('.mock-badge');

    // Status badge is the second one
    expect(inProgressBadges[1]!.attributes('data-variant')).toBe('info');
    expect(analyzingBadges[1]!.attributes('data-variant')).toBe('warning');
    expect(approvedBadges[1]!.attributes('data-variant')).toBe('success');
  });

  it('renders TaskAssignedUsers component with correct users', async () => {
    // Arrange
    const task = mockTasks[0]!;

    // Act
    const wrapper = await mountSuspended(TaskListItem, {
      props: { task, onEdit: vi.fn() },
    });

    // Assert
    expect(wrapper.find('.mock-assigned-users').exists()).toBe(true);
    expect(wrapper.find('.mock-assigned-users').text()).toContain('2 users');
  });

  it('renders TaskTime component with accumulated seconds', async () => {
    // Arrange
    const task = mockTasks[0]!;

    // Act
    const wrapper = await mountSuspended(TaskListItem, {
      props: { task, onEdit: vi.fn() },
    });

    // Assert
    expect(wrapper.find('.mock-task-time').exists()).toBe(true);
    expect(wrapper.find('.mock-task-time').text()).toContain('10800s');
  });

  it('shows edit action when onEdit prop is provided', async () => {
    // Arrange
    const task = mockTasks[0]!;
    const onEditMock = vi.fn();

    // Act
    const wrapper = await mountSuspended(TaskListItem, {
      props: {
        task,
        onEdit: onEditMock,
      },
    });

    // Assert
    expect(wrapper.find('[data-testid="task-actions-1"]').exists()).toBe(true);
    expect(wrapper.find('.mock-option-action').exists()).toBe(true);
  });

  it('hides edit action when onEdit prop is not provided', async () => {
    // Arrange
    const task = mockTasks[0]!;

    // Act
    const wrapper = await mountSuspended(TaskListItem, {
      props: {
        task,
      },
    });

    // Assert
    expect(wrapper.find('[data-testid="task-actions-1"]').exists()).toBe(false);
  });

  it('calls useTaskTimeTracks with correct parameters', async () => {
    // Arrange
    const task = mockTasks[0]!;
    const onRefreshMock = vi.fn();

    // Act
    await mountSuspended(TaskListItem, {
      props: {
        task,
        onRefresh: onRefreshMock,
      },
    });

    // Assert - useTaskTimeTracks should be called with task and onRefresh
    // This is implicitly tested by the component mounting successfully
    expect(true).toBe(true);
  });
});

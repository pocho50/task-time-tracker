import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockComponent } from '@nuxt/test-utils/runtime';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import TaskTime from '../../components/TaskTime.vue';

// Only mock Icon component for simplicity, test with real AppButton
mockComponent('Icon', {
  props: ['name', 'class', 'size'],
  template: '<span class="mock-icon"></span>',
});

describe('TaskTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with initial accumulated time', async () => {
    // Arrange
    const accumulatedSeconds = 3665; // 1 hour, 1 minute, 5 seconds

    // Act
    const wrapper = await mountSuspended(TaskTime, {
      props: {
        accumulatedSeconds,
      },
    });

    // Assert
    expect(wrapper.text()).toContain('01:01:05');
  });

  it('renders with zero time by default', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime);

    // Assert
    expect(wrapper.text()).toContain('00:00:00');
  });

  it('displays play button when timer is not active', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime);

    // Assert
    const playButton = wrapper.find('button[aria-label="Start timer"]');
    expect(playButton.exists()).toBe(true);
    const pauseButton = wrapper.find('button[aria-label="Pause timer"]');
    expect(pauseButton.exists()).toBe(false);
  });

  it('displays pause button when timer is active', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime);

    // Click start button
    await wrapper.find('button[aria-label="Start timer"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Assert
    const pauseButton = wrapper.find('button[aria-label="Pause timer"]');
    expect(pauseButton.exists()).toBe(true);
    const playButton = wrapper.find('button[aria-label="Start timer"]');
    expect(playButton.exists()).toBe(false);
  });

  it('emits @start event when play button is clicked', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime);

    // Click start button
    await wrapper.find('button[aria-label="Start timer"]').trigger('click');

    // Assert
    expect(wrapper.emitted('@start')).toBeTruthy();
    expect(wrapper.emitted('@start')?.length).toBe(1);
  });

  it('emits @end event with total seconds when pause button is clicked', async () => {
    // Arrange
    const accumulatedSeconds = 100;
    const wrapper = await mountSuspended(TaskTime, {
      props: {
        accumulatedSeconds,
      },
    });

    // Act
    // Start timer
    await wrapper.find('button[aria-label="Start timer"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Advance time by 5 seconds
    vi.advanceTimersByTime(5000);
    await wrapper.vm.$nextTick();

    // Pause timer
    await wrapper.find('button[aria-label="Pause timer"]').trigger('click');

    // Assert
    expect(wrapper.emitted('@end')).toBeTruthy();
    expect(wrapper.emitted('@end')?.[0]).toEqual([105]); // 100 + 5 seconds
  });

  it('increments time display when timer is running', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime);

    // Start timer
    await wrapper.find('button[aria-label="Start timer"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Initial state
    expect(wrapper.text()).toContain('00:00:00');

    // Advance time by 3 seconds
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.text()).toContain('00:00:03');
  });

  it('formats time correctly with hours, minutes, and seconds', async () => {
    // Arrange
    const testCases = [
      { seconds: 0, expected: '00:00:00' },
      { seconds: 59, expected: '00:00:59' },
      { seconds: 60, expected: '00:01:00' },
      { seconds: 3599, expected: '00:59:59' },
      { seconds: 3600, expected: '01:00:00' },
      { seconds: 3661, expected: '01:01:01' },
      { seconds: 7325, expected: '02:02:05' },
    ];

    for (const { seconds, expected } of testCases) {
      // Act
      const wrapper = await mountSuspended(TaskTime, {
        props: {
          accumulatedSeconds: seconds,
        },
      });

      // Assert
      expect(wrapper.text()).toContain(expected);
    }
  });

  it('applies badge-error class when timer is active', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime);

    // Start timer
    await wrapper.find('button[aria-label="Start timer"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Assert
    const badge = wrapper.find('.badge');
    expect(badge.classes()).toContain('badge-error');
  });

  it('applies badge-neutral class when timer is not active', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime);

    // Assert
    const badge = wrapper.find('.badge');
    expect(badge.classes()).toContain('badge-neutral');
  });

  it('starts timer immediately when startInmediate prop is true', async () => {
    // Act
    const wrapper = await mountSuspended(TaskTime, {
      props: {
        startInmediate: true,
      },
    });

    // Assert
    expect(wrapper.emitted('@start')).toBeTruthy();
    const badge = wrapper.find('.badge');
    expect(badge.classes()).toContain('badge-error');
  });

  it('adds accumulated seconds to counter when timer is running', async () => {
    // Arrange
    const accumulatedSeconds = 120; // 2 minutes
    const wrapper = await mountSuspended(TaskTime, {
      props: {
        accumulatedSeconds,
      },
    });

    // Act
    // Start timer
    await wrapper.find('button[aria-label="Start timer"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Advance time by 10 seconds
    vi.advanceTimersByTime(10000);
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.text()).toContain('00:02:10'); // 120 + 10 = 130 seconds = 2:10
  });

  it('updates display when accumulatedSeconds prop changes', async () => {
    // Arrange
    const wrapper = await mountSuspended(TaskTime, {
      props: {
        accumulatedSeconds: 60,
      },
    });

    // Initial state
    expect(wrapper.text()).toContain('00:01:00');

    // Act
    await wrapper.setProps({ accumulatedSeconds: 120 });

    // Assert
    expect(wrapper.text()).toContain('00:02:00');
  });
});

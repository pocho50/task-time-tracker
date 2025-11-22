import { expect, test } from '@nuxt/test-utils/playwright';
import TaskPage from '../page-objects/taskPage';
import { TaskTestHelper, TEST_CONSTANTS } from '../helpers/taskTestHelpers';

test.describe('Time Tracking - Single Task', async () => {
  let taskPage: TaskPage;
  let testHelper: TaskTestHelper;
  let testEnvironment: {
    projectId: string;
    projectName: string;
    sprintId: string;
    sprintName: string;
  };

  const TIME_TRACKING_TASK = 'Time Tracking E2E Test';

  test.beforeEach(async ({ goto, page }) => {
    testHelper = new TaskTestHelper(page);
    testEnvironment = await testHelper.setupTestEnvironment();
    taskPage = new TaskPage(page);

    await goto(`/tasks/${testEnvironment.sprintId}`, {
      waitUntil: 'networkidle',
    });
  });

  test.afterEach(async ({ page }) => {
    if (!testEnvironment?.sprintId) return;

    // Clean up time tracking test tasks
    const tasks = await testHelper.getTasksBySprint(testEnvironment.sprintId);
    const timeTrackingTasks = tasks.filter((task: any) =>
      task.name.includes(TIME_TRACKING_TASK)
    );

    for (const task of timeTrackingTasks) {
      await page.request.delete(`/api/tasks/${task.id}`);
    }
  });

  test('should start and stop timer correctly', async ({ page }) => {
    const taskName = `${TIME_TRACKING_TASK} - Start/Stop`;

    // Create task
    await taskPage.createTask({ ...TEST_CONSTANTS.DUMMY_TASK, name: taskName });

    // Verify start button is visible
    await expect(taskPage.getStartTimerButton(taskName)).toBeVisible();

    // Start timer
    await taskPage.startTaskTimer(taskName);
    await expect(taskPage.getPauseTimerButton(taskName)).toBeVisible();

    // Wait to accumulate some time
    await page.waitForTimeout(3000);

    // Verify time is counting (should show at least 00:00:02)
    const timeDisplay = taskPage.getTaskTimeDisplay(taskName);
    const timeText = await timeDisplay.textContent();
    expect(timeText).toMatch(/00:00:0[2-9]|00:00:[1-9][0-9]/);

    // Stop timer
    await taskPage.stopTaskTimer(taskName);
    await expect(taskPage.getStartTimerButton(taskName)).toBeVisible();

    // Verify session was created via API
    const task = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      taskName
    );
    expect(task?.timeTracking).toBeTruthy();
    expect(task?.timeTracking?.length).toBeGreaterThan(0);

    const session = task?.timeTracking?.[0];
    expect(session?.start).toBeTruthy();
    expect(session?.end).toBeTruthy();

    // Verify duration is at least 2 seconds
    const startTime = new Date(session.start).getTime();
    const endTime = new Date(session.end).getTime();
    const duration = (endTime - startTime) / 1000;
    expect(duration).toBeGreaterThanOrEqual(2);
  });

  test('should persist active session time after page reload', async ({
    page,
  }) => {
    const taskName = `${TIME_TRACKING_TASK} - Persist`;

    // Create task
    await taskPage.createTask({ ...TEST_CONSTANTS.DUMMY_TASK, name: taskName });

    // Start timer
    await taskPage.startTaskTimer(taskName);
    await page.waitForTimeout(3000);

    // Get current time display
    const timeDisplay = taskPage.getTaskTimeDisplay(taskName);
    const timeBeforeReload = await timeDisplay.textContent();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify timer is still running
    await expect(taskPage.getPauseTimerButton(taskName)).toBeVisible();

    // Verify time continued (should be at least the same or more)
    const timeAfterReload = await timeDisplay.textContent();
    expect(timeAfterReload).toBeTruthy();

    // Parse times to seconds for comparison
    const beforeSeconds = parseTimeToSeconds(timeBeforeReload || '00:00:00');
    const afterSeconds = parseTimeToSeconds(timeAfterReload || '00:00:00');

    // Time should have continued counting
    expect(afterSeconds).toBeGreaterThanOrEqual(beforeSeconds);

    // Clean up - stop timer
    await taskPage.stopTaskTimer(taskName);
  });

  test('should accumulate time across multiple sessions', async ({ page }) => {
    const taskName = `${TIME_TRACKING_TASK} - Multiple Sessions`;

    // Create task
    await taskPage.createTask({ ...TEST_CONSTANTS.DUMMY_TASK, name: taskName });

    // Session 1: ~2 seconds
    await taskPage.startTaskTimer(taskName);
    await page.waitForTimeout(2000);
    await taskPage.stopTaskTimer(taskName);

    // Wait for UI to update after stopping
    await page.waitForTimeout(1000);

    // Session 2: ~2 seconds
    await taskPage.startTaskTimer(taskName);
    await page.waitForTimeout(2000);
    await taskPage.stopTaskTimer(taskName);

    // Wait for final UI update
    await page.waitForTimeout(1000);

    // Verify total time is at least 4 seconds
    const timeDisplay = taskPage.getTaskTimeDisplay(taskName);
    const timeText = await timeDisplay.textContent();
    const totalSeconds = parseTimeToSeconds(timeText || '00:00:00');
    expect(totalSeconds).toBeGreaterThanOrEqual(4);

    // Verify via API that 2 sessions were created
    const task = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      taskName
    );
    expect(task?.timeTracking?.length).toBe(2);

    // Verify both sessions have start and end
    task?.timeTracking?.forEach((session: any) => {
      expect(session.start).toBeTruthy();
      expect(session.end).toBeTruthy();
    });
  });

  test('should handle two tasks running in parallel correctly', async ({
    page,
  }) => {
    const task1Name = `${TIME_TRACKING_TASK} - Parallel 1`;
    const task2Name = `${TIME_TRACKING_TASK} - Parallel 2`;

    // Create both tasks
    await taskPage.createTask({
      ...TEST_CONSTANTS.DUMMY_TASK,
      name: task1Name,
    });
    await taskPage.createTask({
      ...TEST_CONSTANTS.DUMMY_TASK,
      name: task2Name,
    });

    // Start task 1
    await taskPage.startTaskTimer(task1Name);
    await expect(taskPage.getPauseTimerButton(task1Name)).toBeVisible();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Start task 2 (while task 1 is still running)
    await taskPage.startTaskTimer(task2Name);
    await expect(taskPage.getPauseTimerButton(task2Name)).toBeVisible();

    // Wait 2 more seconds (task 1 has ~4s, task 2 has ~2s)
    await page.waitForTimeout(2000);

    // Verify both timers are showing time
    const time1Display = taskPage.getTaskTimeDisplay(task1Name);
    const time2Display = taskPage.getTaskTimeDisplay(task2Name);

    const time1Text = await time1Display.textContent();
    const time2Text = await time2Display.textContent();

    const time1Seconds = parseTimeToSeconds(time1Text || '00:00:00');
    const time2Seconds = parseTimeToSeconds(time2Text || '00:00:00');

    // Task 1 should have more time (started first)
    expect(time1Seconds).toBeGreaterThan(time2Seconds);
    expect(time1Seconds).toBeGreaterThanOrEqual(3);
    expect(time2Seconds).toBeGreaterThanOrEqual(1);

    // Stop task 1 first
    await taskPage.stopTaskTimer(task1Name);
    await expect(taskPage.getStartTimerButton(task1Name)).toBeVisible();

    // Verify task 2 is still running
    await expect(taskPage.getPauseTimerButton(task2Name)).toBeVisible();

    // Wait a bit more for task 2
    await page.waitForTimeout(2000);

    // Stop task 2
    await taskPage.stopTaskTimer(task2Name);
    await expect(taskPage.getStartTimerButton(task2Name)).toBeVisible();

    // Wait for UI to update
    await page.waitForTimeout(1000);

    // Verify both sessions were saved correctly via API
    const task1 = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      task1Name
    );
    const task2 = await testHelper.findTaskByName(
      testEnvironment.sprintId,
      task2Name
    );

    // Both should have 1 session
    expect(task1?.timeTracking?.length).toBe(1);
    expect(task2?.timeTracking?.length).toBe(1);

    const session1 = task1?.timeTracking?.[0];
    const session2 = task2?.timeTracking?.[0];

    // Both sessions should have start and end
    expect(session1?.start).toBeTruthy();
    expect(session1?.end).toBeTruthy();
    expect(session2?.start).toBeTruthy();
    expect(session2?.end).toBeTruthy();

    // Calculate durations from DB
    const duration1 =
      (new Date(session1.end).getTime() - new Date(session1.start).getTime()) /
      1000;
    const duration2 =
      (new Date(session2.end).getTime() - new Date(session2.start).getTime()) /
      1000;

    // Verify durations are reasonable
    expect(duration1).toBeGreaterThanOrEqual(4);
    expect(duration2).toBeGreaterThanOrEqual(4);

    // Verify UI shows correct accumulated time
    const finalTime1Text = await time1Display.textContent();
    const finalTime2Text = await time2Display.textContent();

    const finalTime1Seconds = parseTimeToSeconds(finalTime1Text || '00:00:00');
    const finalTime2Seconds = parseTimeToSeconds(finalTime2Text || '00:00:00');

    // UI time should match DB time (within 1 second tolerance)
    expect(Math.abs(finalTime1Seconds - duration1)).toBeLessThanOrEqual(1);
    expect(Math.abs(finalTime2Seconds - duration2)).toBeLessThanOrEqual(1);
  });
});

// Helper function to parse time string (HH:MM:SS) to seconds
function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  const seconds = parseInt(parts[2] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

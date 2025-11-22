import type {
  SerializedTimeTrackWithUser,
  SerializedTaskWithUsersAndTimeTracks,
} from '../shared/types';
import { safeApiCall } from '#layers/shared/utils';

export function useTaskTimeTracks(
  task: Ref<SerializedTaskWithUsersAndTimeTracks>,
  refreshTasks?: () => Promise<void>
) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);
  const { user } = useUser();
  const currentTimeTrackSession = ref<SerializedTimeTrackWithUser | null>(null);

  // Use embedded time tracking data instead of making a separate API call
  const getTimeTracks = computed(() => task.value.timeTracking ?? []);

  // Check for active session on initialization (only for current user)
  const checkActiveSessionAndSetLastSession = () => {
    const lastTrack = getLastSession.value;

    // If the last track has no end time, it's an active session that needs to be recovered
    if (lastTrack && lastTrack.start && !lastTrack.end) {
      currentTimeTrackSession.value = lastTrack;
    }
  };

  const getLastSession = computed(() => {
    const tracks = getTimeTracks.value;
    // Filter tracks for current user only
    const userTracks = tracks.filter(
      (track) => track.user.id === user.value?.id
    );
    return userTracks?.[0] ?? null;
  });

  // Initialize active session check
  checkActiveSessionAndSetLastSession();

  const getTimeAccumulatedSeconds = computed(() => {
    const tracks = getTimeTracks.value;
    // Filter tracks for current user only
    const userTracks = tracks.filter(
      (track) => track.user.id === user.value?.id
    );

    return userTracks.reduce((acc, timeTrack) => {
      // Skip sessions without start/end - active sessions are handled by TaskTime component's counter
      if (!timeTrack.start || !timeTrack.end) return acc;

      const startTime = new Date(timeTrack.start).getTime();
      const endTime = new Date(timeTrack.end).getTime();

      // Validate that the dates are valid and that end >= start
      if (isNaN(startTime) || isNaN(endTime) || endTime < startTime) {
        return acc;
      }

      const diffInMs = endTime - startTime;
      return acc + Math.floor(diffInMs / 1000);
    }, 0);
  });

  const handleStart = async () => {
    // Don't start a new session if there's already an active one
    if (currentTimeTrackSession.value) {
      return;
    }

    const response = await safeApiCall(() =>
      taskRepo.startSession(task.value.id)
    );
    if (response !== false) {
      currentTimeTrackSession.value = response.data;
      // Refresh the parent task list to get updated time tracking data
      if (refreshTasks) {
        await refreshTasks();
      }
    }
  };

  const handleEnd = async () => {
    if (!currentTimeTrackSession.value) return;

    const result = await safeApiCall(() =>
      taskRepo.endSession(currentTimeTrackSession.value!.id, task.value.id)
    );

    if (result !== false) {
      currentTimeTrackSession.value = null;
      // Refresh the parent task list to get updated time tracking data
      if (refreshTasks) {
        await refreshTasks();
      }
    }
  };

  const handleUpdateSession = async (data: {
    start: string;
    end: string | null;
    notes: string | null;
  }) => {
    if (!getLastSession.value) return false;

    const response = await safeApiCall(() =>
      taskRepo.updateSession({
        id: getLastSession.value!.id,
        taskId: task.value.id,
        start: data.start,
        end: data.end,
        notes: data.notes,
        fullUpdate: true, // Explicitly mark as full session edit
      })
    );

    if (response !== false) {
      // Refresh the parent task list to get updated time tracking data
      if (refreshTasks) {
        await refreshTasks();
      }
      return true;
    }

    return false;
  };

  return {
    getTimeTracks,
    getTimeAccumulatedSeconds,
    handleStart,
    handleEnd,
    handleUpdateSession,
    currentTimeTrackSession,
    getLastSession,
  };
}

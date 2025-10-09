import type {
  SerializedTimeTrackWithUser,
  SerializedTaskWithUsersAndTimeTracks,
} from '../shared/types';

export function useTaskTimeTracks(
  task: SerializedTaskWithUsersAndTimeTracks,
  refreshTasks?: () => Promise<void>
) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);
  const { user } = useUser();
  const currentTimeTrackSession = ref<SerializedTimeTrackWithUser | null>(null);

  // Use embedded time tracking data instead of making a separate API call
  const getTimeTracks = computed(() => task.timeTracking ?? []);

  // Check for active session on initialization (only for current user)
  const checkActiveSession = () => {
    const tracks = getTimeTracks.value;
    // Filter tracks for current user only
    const userTracks = tracks.filter(
      (track) => track.user.id === user.value?.id
    );
    const lastTrack = userTracks[0];

    // If the last track has no end time, it's an active session that needs to be recovered
    if (lastTrack && lastTrack.start && !lastTrack.end) {
      currentTimeTrackSession.value = lastTrack;
    }
  };

  // Initialize active session check
  checkActiveSession();

  const getTimeAccumulatedSeconds = computed(() => {
    const tracks = getTimeTracks.value;
    // Filter tracks for current user only
    const userTracks = tracks.filter(
      (track) => track.user.id === user.value?.id
    );

    return userTracks.reduce((acc, timeTrack, index) => {
      if (!timeTrack.start) return acc;

      const startTime = new Date(timeTrack.start).getTime();
      const isLastItem = index === 0;

      // Only the last item can have end null (active session)
      const endTime = timeTrack.end
        ? new Date(timeTrack.end).getTime()
        : isLastItem
          ? Date.now()
          : startTime; // If not the last item and there is no end, ignore it

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

    const response = await taskRepo.startSession(task.id);
    currentTimeTrackSession.value = response.data;
    // Refresh the parent task list to get updated time tracking data
    if (refreshTasks) {
      await refreshTasks();
    }
  };

  const handleEnd = async () => {
    if (!currentTimeTrackSession.value) return;
    await taskRepo.endSession(currentTimeTrackSession.value.id, task.id);
    currentTimeTrackSession.value = null;
    // Refresh the parent task list to get updated time tracking data
    if (refreshTasks) {
      await refreshTasks();
    }
  };

  return {
    getTimeTracks,
    getTimeAccumulatedSeconds,
    handleStart,
    handleEnd,
    currentTimeTrackSession,
  };
}

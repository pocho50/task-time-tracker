import type { SerializedTimeTrackWithUser } from '../shared/types';
export async function useTaskTimeTracks(taskId: string) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);
  const { user } = useUser();
  const currentTimeTrackSession = ref<SerializedTimeTrackWithUser | null>(null);

  const { data, refresh, status } = await useAsyncData(
    `task-time-tracks-${taskId}`,
    async () => {
      return await taskRepo.getTimeTracks(taskId);
    }
  );
  const getTimeTracks = computed(() => data.value?.data ?? []);

  // Check for active session on initialization (only for current user)
  const checkActiveSession = () => {
    const tracks = getTimeTracks.value;
    // Filter tracks for current user only
    const userTracks = tracks.filter(track => track.user.id === user.value?.id);
    const lastTrack = userTracks[0];

    // If the last track has no end time, it's an active session that needs to be recovered
    if (lastTrack && lastTrack.start && !lastTrack.end) {
      currentTimeTrackSession.value = lastTrack;
    }
  };

  if (status.value === 'success') {
    checkActiveSession();
  }

  const getTimeAccumulatedSeconds = computed(() => {
    const tracks = getTimeTracks.value;
    // Filter tracks for current user only
    const userTracks = tracks.filter(track => track.user.id === user.value?.id);

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

    const response = await taskRepo.startSession(taskId);
    currentTimeTrackSession.value = response.data;
    await refresh();
  };

  const handleEnd = async () => {
    if (!currentTimeTrackSession.value) return;
    await taskRepo.endSession(currentTimeTrackSession.value.id, taskId);
    currentTimeTrackSession.value = null;
  };

  return {
    refresh,
    status,
    getTimeTracks,
    getTimeAccumulatedSeconds,
    handleStart,
    handleEnd,
    currentTimeTrackSession,
  };
}

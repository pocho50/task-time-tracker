export function useTaskTimeTracks(taskId: string) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);

  const { data, refresh, status } = useAsyncData(
    `task-time-tracks-${taskId}`,
    async () => {
      return await taskRepo.getTimeTracks(taskId);
    }
  );

  const getTimeTracks = computed(() => data.value?.data ?? []);

  const getTimeAccumulatedSeconds = computed(() => {
    const tracks = getTimeTracks.value;

    return tracks.reduce((acc, timeTrack, index) => {
      if (!timeTrack.start) return acc;

      const startTime = new Date(timeTrack.start).getTime();
      const isLastItem = index === tracks.length - 1;

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

  return {
    refresh,
    status,
    getTimeTracks,
    getTimeAccumulatedSeconds,
  };
}

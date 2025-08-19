export function useTasks(sprintId: string | undefined) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);
  const page = useRouteQuery('page', 1, { transform: Number });
  const sprintIdRef = ref(sprintId);
  const { data, refresh, status } = useAsyncData(
    `tasks-${sprintId}`,
    async () => {
      if (!sprintIdRef.value) {
        return { data: [], pagination: {} };
      }
      taskRepo.setParams({ page: page.value });
      return await taskRepo.getBySprintId(sprintIdRef.value);
    },
    {
      watch: [sprintIdRef, page],
    }
  );

  const tasks = computed(
    () => data.value?.data ?? ([] as SerializedTaskWithUsers[])
  );
  const pagination = computed(() => data.value?.pagination ?? null);

  return {
    tasks,
    pagination,
    page,
    status,
    sprintIdRef,
    refresh,
  };
}

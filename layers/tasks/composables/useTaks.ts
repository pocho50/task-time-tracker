export function useTasks(sprintId: string) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);
  const page = useRouteQuery('page', 1, { transform: Number });
  const sprintIdRef = ref(sprintId);
  const { data, refresh, status } = useAsyncData(
    `tasks-${sprintId}`,
    () => {
      taskRepo.setParams({ page: page.value });
      return taskRepo.getBySprintId(sprintIdRef.value);
    },
    {
      watch: [sprintIdRef, page],
    }
  );

  const tasks = computed(() => data.value?.data ?? []);
  //const meta = computed(() => data.value?.meta ?? null);
}

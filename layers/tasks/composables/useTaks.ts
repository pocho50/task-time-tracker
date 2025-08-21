export function useTasks(sprintId: string | undefined) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);
  const sprintRepo = new SprintsRepo($api);
  const page = useRouteQuery('page', 1, { transform: Number });
  const sprintIdRef = ref(sprintId);

  const {
    data,
    refresh,
    status: tasksStatus,
  } = useAsyncData(
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

  const { projects, status: projectsStatus } = useProjects();
  /**
   * Get the project ID based on current context
   * Priority: sprint's project > first available project > task's project
   */
  const getProjectId = async () => {
    // If no tasks but sprint is selected, get project from sprint
    if (tasks.value.length === 0 && sprintIdRef.value) {
      const sprint = await sprintRepo.getById(sprintIdRef.value as string);
      return sprint?.projectId;
    }

    // If no sprint selected, use first available project as fallback
    if (!sprintIdRef.value) {
      return projects.value[0]?.id;
    }

    // Otherwise, use project from first task
    return tasks.value[0]?.projectId;
  };

  const status = computed(() => {
    if (tasksStatus.value === 'success' && projectsStatus.value === 'success') {
      return 'success';
    }
    return 'pending';
  });

  return {
    tasks,
    pagination,
    page,
    status,
    sprintIdRef,
    refresh,
    getProjectId,
  };
}

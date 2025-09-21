import { TaskPriority, TaskStatus } from '@prisma/client';

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

  // Edit functionality
  const openDrawer = ref(false);
  const selectedTask = ref<TaskFormData | undefined>(undefined);

  const handleEdit = (id: string) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      selectedTask.value = {
        id: task.id,
        name: task.name,
        description: task.description || '',
        projectId: task.projectId,
        sprintId: task.sprintId || undefined,
        priority: task.priority,
        status: task.status,
        estimatedHours: task.estimatedHours || undefined,
        usersId: task.usersId,
      };
      openDrawer.value = true;
    }
  };

  const handleAdd = async () => {
    // Pre-populate with current context for new tasks
    const projectId = await getProjectId();
    selectedTask.value = {
      projectId: projectId || '', // Fallback to empty string if no project
      sprintId: sprintIdRef.value || undefined,
      name: '',
      description: '',
      priority: TaskPriority.MEDIUM, // Default priority
      status: TaskStatus.ANALYZING, // Default status
      usersId: [],
    };
    openDrawer.value = true;
  };

  const handleSave = async (taskData: TaskFormData) => {
    // Add projectId and sprintId to the task data for new tasks
    const projectId = taskData.projectId || (await getProjectId()) || '';
    const dataWithContext = {
      ...taskData,
      projectId,
      sprintId: taskData.sprintId || sprintIdRef.value,
    };

    const result = await safeApiCall(() => taskRepo.save(dataWithContext));
    if (result !== false) {
      refresh();
      openDrawer.value = false;
    }
    return result !== false;
  };

  const handleRemove = async (id: string) => {
    const result = await safeApiCall(() => taskRepo.delete(id));
    if (result !== false) {
      refresh();
    }
    return result !== false;
  };

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
    openDrawer,
    selectedTask,
    handleEdit,
    handleAdd,
    handleSave,
    handleRemove,
  };
}

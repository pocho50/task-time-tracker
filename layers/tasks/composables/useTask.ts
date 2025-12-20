import { TaskPriority, TaskStatus } from '@prisma/client';
import type { SerializedTaskWithUsersAndTimeTracks } from '../shared/types';
import { ROLES } from '#layers/shared/utils/constants';

export function useIsUserAssignedToTask(
  task:
    | Ref<SerializedTaskWithUsersAndTimeTracks | null | undefined>
    | MaybeRefOrGetter<SerializedTaskWithUsersAndTimeTracks | null | undefined>
) {
  const { user } = useUserSession();

  const isUserAssignedToTask = computed(() => {
    const taskValue = toValue(task);

    if (user.value?.role === ROLES.ADMIN) return true;
    if (!user.value?.id || !taskValue?.users) return false;

    return taskValue.users.some((taskUser) => taskUser.id === user.value?.id);
  });

  return {
    isUserAssignedToTask,
  };
}

export function useTasks(sprintId: string | undefined) {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);
  const sprintRepo = new SprintsRepo($api);
  const sprintIdRef = ref(sprintId);
  const { user } = useUser();

  const { projects, status: projectsStatus } = useProjects(true);

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
      taskRepo.setParams({ pageSize: Infinity });
      return await taskRepo.getBySprintId(sprintIdRef.value);
    },
    {
      watch: [sprintIdRef],
    }
  );

  const tasks = computed(
    () => data.value?.data ?? ([] as SerializedTaskWithUsersAndTimeTracks[])
  );
  const pagination = computed(() => data.value?.pagination ?? null);

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

    // Auto-assign to current user if they have USER role
    const defaultUsersId =
      user.value?.role === ROLES.USER && user.value?.id ? [user.value.id] : [];

    selectedTask.value = {
      projectId: projectId || '', // Fallback to empty string if no project
      sprintId: sprintIdRef.value || undefined,
      name: '',
      description: '',
      priority: TaskPriority.MEDIUM, // Default priority
      status: TaskStatus.ANALYZING, // Default status
      usersId: defaultUsersId,
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
      const sprint = await safeApiCall(() =>
        sprintRepo.getById(sprintIdRef.value as string)
      );
      if (sprint !== false) {
        return sprint?.projectId;
      }
    }

    // If no sprint selected, use first available project as fallback
    if (!sprintIdRef.value) {
      return projects.value[0]?.id;
    }

    // Otherwise, use project from first task
    return tasks.value[0]?.projectId;
  };

  async function getLastSprintFromProject(idProject?: string) {
    const projectId = idProject || (await getProjectId());
    if (projectId) {
      const result = await safeApiCall(() =>
        sprintRepo.getByProjectId(projectId)
      );
      const sprint = result !== false ? result : null;
      if (sprint?.data?.[0]) {
        return sprint.data[0].id;
      }
    }

    return undefined;
  }

  const status = computed(() => {
    if (tasksStatus.value === 'success' && projectsStatus.value === 'success') {
      return 'success';
    }

    if (tasksStatus.value === 'error' || projectsStatus.value === 'error') {
      return 'error';
    }

    if (tasksStatus.value === 'pending' || projectsStatus.value === 'pending') {
      return 'pending';
    }
    return tasksStatus.value;
  });

  return {
    tasks,
    pagination,
    status,
    projectsStatus,
    sprintIdRef,
    refresh,
    getProjectId,
    getLastSprintFromProject,
    openDrawer,
    selectedTask,
    handleEdit,
    handleAdd,
    handleSave,
    handleRemove,
  };
}

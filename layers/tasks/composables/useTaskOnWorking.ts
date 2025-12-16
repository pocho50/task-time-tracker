import type { SerializedWorkingSession } from '../shared/types';

export function useTaskOnWorking() {
  const { $api } = useNuxtApp();
  const taskRepo = new TaskRepo($api);

  const {
    data: workingTasksData,
    refresh,
    status: workingTasksStatus,
  } = useAsyncData('workingTasks', async () => {
    taskRepo.setParams({ pageSize: Infinity });
    return await taskRepo.getWorkingTasks();
  });

  useWsTasks(refresh);

  const workingSessions = computed(
    () => workingTasksData.value?.data ?? ([] as SerializedWorkingSession[])
  );

  return {
    workingSessions,
    workingTasksStatus,
  };
}

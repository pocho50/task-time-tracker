import { safeApiCall } from '#layers/shared/utils';
import type { SprintFormData } from '../schemas';

export function useSprints(projectId: string) {
  const { $api } = useNuxtApp();
  const sprintRepo = new SprintsRepo($api);
  const page = useRouteQuery('page', 1, { transform: Number });
  const projectIdRef = ref(projectId);

  const { data, refresh, status } = useAsyncData(
    `sprints-${projectIdRef.value}`,
    () => {
      if (!projectIdRef.value) {
        return Promise.resolve({
          data: [] as any[],
          pagination: { page: 1, pageCount: 1 },
        });
      }
      sprintRepo.setParams({ page: page.value });
      return sprintRepo.getByProjectId(projectIdRef.value);
    },
    {
      watch: [page, projectIdRef], // Auto-refresh when projectId or page changes
    }
  );

  const sprints = computed(() => data.value?.data ?? []);
  const pagination = computed(() => data.value?.pagination ?? null);

  // Drawer state management
  const openDrawer = ref(false);
  const selectedSprint = ref<SprintFormData | undefined>(undefined);

  function handleEdit(id: string) {
    const sprint = sprints.value.find((s) => s.id === id);
    if (sprint) {
      selectedSprint.value = {
        id: sprint.id,
        name: sprint.name,
        startDate: sprint.startDate
          ? new Date(sprint.startDate).toISOString().split('T')[0]
          : undefined,
        endDate: sprint.endDate
          ? new Date(sprint.endDate).toISOString().split('T')[0]
          : undefined,
        status: sprint.status,
        projectId: sprint.projectId,
      };
    }
    openDrawer.value = true;
  }

  function handleAdd() {
    selectedSprint.value = undefined;
    openDrawer.value = true;
  }

  const handleSave = async (sprintData: SprintFormData) => {
    // Add projectId to the sprint data
    const dataWithProject = {
      ...sprintData,
      projectId: projectIdRef.value,
    };

    const result = await safeApiCall(() => sprintRepo.save(dataWithProject));
    if (result !== false) {
      refresh();
      openDrawer.value = false;
    }
    return result !== false;
  };

  async function handleRemove(id: string) {
    const result = await safeApiCall(() => sprintRepo.delete(id));
    if (result !== false) {
      refresh();
    }
    return result !== false;
  }

  return {
    sprints,
    pagination,
    page,
    status,
    projectIdRef,
    openDrawer,
    selectedSprint,
    handleEdit,
    handleAdd,
    handleSave,
    handleRemove,
    refresh,
  };
}

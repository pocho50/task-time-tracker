import { SprintsRepo } from '../repository/sprintRepo';

export function useSprints(projectId: string) {
  const { $api } = useNuxtApp();
  const sprintRepo = new SprintsRepo($api);
  const page = useRouteQuery('page', 1, { transform: Number });
  const projectIdRef = ref(projectId);

  const { data, refresh, status } = useAsyncData(
    `sprints-${projectIdRef.value}`,
    () => {
      sprintRepo.setParams({ page: page.value });
      return sprintRepo.getByProjectId(projectIdRef.value);
    },
    {
      watch: [projectIdRef, page], // Auto-refresh when projectId or page changes
    }
  );

  const sprints = computed(() => data.value?.data ?? []);
  const meta = computed(() => data.value?.meta ?? null);

  function handleEdit(id: string) {
    // Implementation for edit functionality will go here
    console.log(`Edit sprint ${id}`);
  }

  function handleAdd() {
    // Implementation for add functionality will go here
    console.log(`Add new sprint`);
  }

  async function handleRemove(id: string) {
    // Implementation for remove functionality will go here
    console.log(`Remove sprint ${id}`);
  }

  return {
    sprints,
    meta,
    page,
    status,
    projectIdRef,
    handleEdit,
    handleAdd,
    handleRemove,
    refresh,
  };
}

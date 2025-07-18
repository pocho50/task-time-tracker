export function useSprints(projectId: string) {
  const page = useRouteQuery('page', 1, { transform: Number });

  watch(page, () => refresh());

  const { data, refresh, status } = useAsyncData(`sprints-${projectId}`, () => {
    return $fetch(`/api/sprints/${projectId}`);
  });

  const sprints = computed(() => data.value?.data ?? []);
  const meta = computed(() => data.value?.meta ?? null);

  function handleEdit(id: string) {
    // Implementation for edit functionality will go here
    console.log(`Edit sprint ${id}`);
  }

  async function handleRemove(id: string) {
    // Implementation for remove functionality will go here
    console.log(`Remove sprint ${id}`);
  }

  return {
    sprints,
    meta,
    refresh,
    status,
    page,
    handleEdit,
    handleRemove,
  };
}

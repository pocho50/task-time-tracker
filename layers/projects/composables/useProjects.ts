import { safeApiCall } from '#layers/shared/utils';

export function useProjects(allProjects = false) {
  const { $api } = useNuxtApp();
  const projectRepo = new ProjectsRepo($api);
  const page = useRouteQuery('page', 1, { transform: Number });

  const key = allProjects
    ? ProjectsRepo.keys.allProjects
    : ProjectsRepo.keys.projects;

  const { data, refresh, status } = useAsyncData(key, () => {
    const params: { page: number; pageSize?: number } = { page: page.value };
    if (allProjects) {
      params.pageSize = Infinity;
    }
    projectRepo.setParams(params);
    return projectRepo.getAll();
  });

  watch(page, () => refresh());

  const openDrawer = ref(false);

  const selectedProject = ref<ProjectFormData | undefined>(undefined);
  const projects = computed(() => data.value?.data ?? []);

  const handleEdit = (id: string) => {
    selectedProject.value = projects.value.find((p) => p.id === id);
    openDrawer.value = true;
  };

  const handleAdd = () => {
    selectedProject.value = undefined;
    openDrawer.value = true;
  };

  const handleSave = async (projectData: ProjectFormData) => {
    const result = await safeApiCall(() => projectRepo.save(projectData));
    if (result !== false) {
      refresh();
      openDrawer.value = false;
    }
    return result !== false;
  };

  const pagination = computed(() => data.value?.pagination);

  const handleRemove = async (id: string) => {
    const result = await safeApiCall(() => projectRepo.delete(id));
    if (result !== false) {
      refresh();
    }
    return result !== false;
  };

  return {
    projects,
    pagination,
    status,
    refresh,
    page,
    openDrawer,
    selectedProject,
    handleEdit,
    handleAdd,
    handleSave,
    handleRemove,
  };
}

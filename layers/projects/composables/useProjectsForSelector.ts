import { ProjectsRepo } from '../repository/projectRepo';

export function useProjectsForSelector() {
  const { $api } = useNuxtApp();
  const projectRepo = new ProjectsRepo($api);

  // Use Infinity to get all projects without pagination
  const { data: projectsData, refresh } = useAsyncData('all-projects', () => {
    projectRepo.setParams({ pageSize: Infinity });
    return projectRepo.getAll();
  });

  const projects = computed(() => projectsData.value?.data ?? []);

  return {
    projects,
    refresh,
  };
}

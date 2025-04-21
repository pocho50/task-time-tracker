import { ref, computed, watch } from "vue";
import {
  useNuxtApp,
  useRouteQuery,
  useAsyncData,
  useTemplateRef,
} from "#imports";

export function useProjects() {
  const { $api } = useNuxtApp();
  const projectRepo = new ProjectsRepo($api);
  const page = useRouteQuery("page", 1, { transform: Number });

  const { data, refresh } = useAsyncData(() => {
    projectRepo.setParams({ page: page.value });
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
    await projectRepo.save(projectData);
    refresh();
    openDrawer.value = false;
  };

  const pagination = computed(() => data.value?.pagination);

  return {
    projects,
    pagination,
    refresh,
    page,
    openDrawer,
    selectedProject,
    handleEdit,
    handleAdd,
    handleSave,
  };
}

<script setup lang="ts">
const { $api } = useNuxtApp();
const projectRepo = new ProjectsRepo($api);
const page = useRouteQuery("page", 1, { transform: Number });

const { data, refresh } = await useAsyncData(() => {
  projectRepo.setParams({ page: page.value });
  return projectRepo.getAll();
});

watch(page, () => {
  refresh();
});

const openDrawer = ref(false);
const projectForm = useTemplateRef("projectForm");
const selectedProject = ref<ProjectFormData | undefined>(undefined);

const projects = computed(() => data.value?.data);

const handleEdit = (id: string) => {
  selectedProject.value = projects.value?.find((p) => p.id === id);
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
</script>
<template>
  <section class="py-12 px-4 bg-base-200">
    <AppTitle text="Projects" />
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      v-if="projects"
    >
      <article
        v-for="project in projects"
        :key="project.id"
        class="card bg-base-100 shadow-md hover:shadow-2xl group relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.03]"
      >
        <AppCardAction
          :actions="['edit', 'remove']"
          @@edit="handleEdit(project.id)"
        />
        <div class="card-body">
          <h2 class="card-title">
            {{ project.name }}
          </h2>
          <p class="text-base-content/80 text-sm mt-1 line-clamp-3">
            {{ project.description }}
          </p>
          <button class="btn btn-default group-hover:btn-primary">
            Select project
          </button>
        </div>
      </article>
    </div>
    <!-- Icon add project fixed button -->
    <AppAddBtn @click="handleAdd" />
    <!-- Pagination -->
    <AppPagination
      v-if="data?.pagination"
      :page="page"
      :totalPages="data?.pagination.pageCount"
      @@prev="page--"
      @@next="page++"
    />
    <!-- Drawer -->
    <AppDrawerRight
      v-model="openDrawer"
      :title="selectedProject ? 'Edit Project' : 'Add Project'"
    >
      <LazyProjectForm
        v-if="openDrawer"
        ref="projectForm"
        :initial-data="selectedProject"
        @@submit="handleSave"
      />
      <template #actions>
        <button
          type="button"
          class="btn btn-default btn-lg"
          @click="openDrawer = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary btn-lg"
          @click="projectForm?.triggerSubmit()"
        >
          Save
        </button>
      </template>
    </AppDrawerRight>
  </section>
</template>

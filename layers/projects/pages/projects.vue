<script setup lang="ts">
const {
  projects,
  pagination,
  page,
  openDrawer,
  selectedProject,
  handleEdit,
  handleAdd,
  handleSave,
  handleRemove,
} = useProjects();

const { userIsAllowedToWrite } = useUser();

// Provide context to child components
provideProjectsContext({
  handleEdit,
  handleRemove,
});

// form template refs
const projectForm = useTemplateRef('projectForm');
</script>
<template>
  <section class="py-12 px-4 bg-base-200">
    <AppTitle :text="$t('title')" />
    <ProjectList :projects="projects ?? []" />
    <AppEmptyState v-if="!projects || projects.length === 0">
      <template #title>{{ $t('emptyState.noProjects') }}</template>
      {{ $t('emptyState.noProjectsDescription') }}
    </AppEmptyState>
    <!-- Icon add project fixed button -->
    <AppAddBtn @click="handleAdd" v-if="userIsAllowedToWrite(ENTITY)" />
    <!-- Pagination -->
    <AppPagination
      v-if="pagination && pagination.pageCount > 1"
      :page="page"
      :totalPages="pagination.pageCount"
      @@prev="page--"
      @@next="page++"
    />
    <!-- Drawer -->
    <AppDrawerRight
      v-model="openDrawer"
      :title="selectedProject ? $t('editProject') : $t('addProject')"
    >
      <LazyProjectForm
        v-if="openDrawer"
        ref="projectForm"
        :initial-data="selectedProject"
        @@submit="handleSave"
      />
      <template #actions>
        <AppButton
          type="button"
          variant="default"
          size="lg"
          @click="openDrawer = false"
        >
          {{ $t('cancel') }}
        </AppButton>
        <AppButton
          type="button"
          variant="primary"
          size="lg"
          @click="projectForm?.triggerSubmit()"
        >
          {{ $t('save') }}
        </AppButton>
      </template>
    </AppDrawerRight>
  </section>
</template>

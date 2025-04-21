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
} = useProjects();

// form template refs
const projectForm = useTemplateRef("projectForm");
</script>
<template>
  <section class="py-12 px-4 bg-base-200">
    <AppTitle text="Projects" />
    <ProjectList :projects="projects ?? []" :onEdit="handleEdit" />
    <!-- Icon add project fixed button -->
    <AppAddBtn @click="handleAdd" />
    <!-- Pagination -->
    <AppPagination
      v-if="pagination"
      :page="page"
      :totalPages="pagination.pageCount"
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

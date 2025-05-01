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

// form template refs
const projectForm = useTemplateRef('projectForm');
</script>
<template>
  <section class="py-12 px-4 bg-base-200">
    <AppTitle :text="$t('title')" />
    <ProjectList
      :projects="projects ?? []"
      :onRemove="handleRemove"
      :onEdit="handleEdit"
    />
    <!-- Icon add project fixed button -->
    <AppAddBtn @click="handleAdd" v-if="userIsAllowedToWrite(ENTITY)" />
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
      :title="selectedProject ? $t('editProject') : $t('addProject')"
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
          {{ $t('cancel') }}
        </button>
        <button
          type="button"
          class="btn btn-primary btn-lg"
          @click="projectForm?.triggerSubmit()"
        >
          {{ $t('save') }}
        </button>
      </template>
    </AppDrawerRight>
  </section>
</template>

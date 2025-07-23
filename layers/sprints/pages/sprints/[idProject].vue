<script setup lang="ts">
const route = useRoute();

const routeProjectId = route.params.idProject;

// Get sprints for the current project (will auto-refresh when selectedProjectId changes)
const { sprints, meta, status, page, handleEdit, handleRemove, projectIdRef } =
  useSprints(routeProjectId as string);

// Handle project change from selector
function handleProjectChange() {
  // Reset to page 1 when switching projects
  page.value = 1;
}
</script>

<template>
  <section class="py-12 px-4 bg-base-200">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <AppTitle :text="$t('sprintList.title')" class="mb-0" />

      <!-- Project Selector -->
      <ProjectSelector
        v-model="projectIdRef"
        :label="$t('sprintList.selectProject')"
        :placeholder="$t('sprintList.selectProject')"
        @change="handleProjectChange"
      />
    </div>
    <SprintList
      :sprints="sprints ?? []"
      :onEdit="handleEdit"
      :onRemove="handleRemove"
    />
    <AppEmptyState
      v-if="(!sprints || sprints.length === 0) && status === 'success'"
    >
      <template #title>{{ $t('sprintList.noSprintsFound') }}</template>
      {{ $t('sprintList.noSprintsFoundDescription') }}
    </AppEmptyState>
    <!-- Pagination -->
    <AppPagination
      v-if="meta && meta.total > 0"
      :page="page"
      :totalPages="Math.ceil(meta.total / 10)"
      @change="(newPage: number) => (page = newPage)"
      class="my-4"
    />
  </section>
</template>

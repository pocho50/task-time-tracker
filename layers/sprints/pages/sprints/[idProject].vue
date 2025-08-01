<script setup lang="ts">
const routeProjectId = useRouteParams('idProject');

// Get sprints for the current project
const {
  sprints,
  meta,
  status,
  page,
  handleEdit,
  handleRemove,
  handleAdd,
  handleSave,
  projectIdRef,
  openDrawer,
  selectedSprint,
} = useSprints(routeProjectId.value as string);

// Handle project change from selector
async function handleProjectChange() {
  // Reset to page 1 when switching projects
  page.value = 1;
  await nextTick();
  routeProjectId.value = projectIdRef.value;
}

// form template refs
const sprintForm = useTemplateRef('sprintForm');
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <AppTitle :text="$t('sprintList.title')" class="mb-0" />

      <!-- Project Selector -->
      <AppProjectSelector
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
    <!-- Add Sprint Button -->
    <AppAddBtn @click="handleAdd" />

    <!-- Drawer -->
    <AppDrawerRight
      v-model="openDrawer"
      :title="selectedSprint ? $t('editSprint') : $t('addSprint')"
    >
      <LazySprintForm
        v-if="openDrawer"
        ref="sprintForm"
        :initial-data="selectedSprint"
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
          @click="sprintForm?.triggerSubmit()"
        >
          {{ $t('save') }}
        </AppButton>
      </template>
    </AppDrawerRight>
  </section>
</template>

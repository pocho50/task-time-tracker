<script setup lang="ts">
const routeSprintId = useRouteParams('idSprint');

// Reactive refs for selected project and sprint
const selectedProjectId = ref<string>();
const selectedSprintId = ref<string>((routeSprintId.value as string) || '');
const loadingProjectId = ref<boolean>(true);

// Get tasks based on selected sprint
const {
  tasks,
  getProjectId,
  sprintIdRef,
  status,
  refresh,
  openDrawer,
  selectedTask,
  handleEdit,
  handleAdd,
  handleSave,
} = useTasks(selectedSprintId.value);

// Set initial project ID from tasks if available, or use first available project
watch(
  status,
  async () => {
    if (status.value === 'success') {
      selectedProjectId.value = await getProjectId();
      loadingProjectId.value = false;
    }
  },
  { immediate: true }
);

// Handle project selection change
function handleProjectChange(projectId: string) {
  selectedProjectId.value = projectId;
  selectedSprintId.value = ''; // Clear sprint selection
}

// Handle sprint selection change
function handleSprintChange(sprintId: string) {
  selectedSprintId.value = sprintId;
}

// Watch for sprint changes to refresh tasks
watch(selectedSprintId, () => {
  sprintIdRef.value = selectedSprintId.value;
  routeSprintId.value = selectedSprintId.value;
});

// Form template refs
const taskForm = useTemplateRef('taskForm');

definePageMeta({
  key: (route) => route.name as string,
});
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <AppTitle :text="$t('taskList.title')" class="mb-0" />

      <!-- Selectors Container -->
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Loading State -->
        <div v-if="!selectedProjectId && loadingProjectId" class="lg:mr-5">
          <AppLoading size="lg" :text="$t('taskList.loadingSelectors')" />
        </div>

        <!-- Loaded Selectors -->
        <template v-else>
          <!-- Project Selector -->
          <AppProjectSelector
            v-model="selectedProjectId"
            :label="$t('taskList.selectProject')"
            :placeholder="$t('taskList.selectProject')"
            @change="handleProjectChange"
          />

          <!-- Sprint Selector -->
          <AppSprintSelector
            v-model="selectedSprintId"
            v-if="selectedProjectId"
            :project-id="selectedProjectId"
            :label="$t('taskList.selectSprint')"
            :placeholder="$t('taskList.selectSprint')"
            @change="handleSprintChange"
          />
        </template>
      </div>
    </div>

    <!-- Loading State -->
    <AppLoading
      v-if="status === 'pending' && selectedSprintId"
      center
      :text="$t('taskList.loadingTasks')"
      size="lg"
    />

    <!-- Tasks List -->
    <TaskList
      v-if="tasks && selectedSprintId && status === 'success'"
      :tasks="tasks"
      :onEdit="handleEdit"
      :onRefresh="refresh"
    />

    <!-- Empty State -->
    <div v-if="!selectedSprintId" class="text-center py-12">
      <Icon
        name="mdi:clipboard-list-outline"
        class="text-6xl text-base-300 mb-4"
      />
      <h3 class="text-lg font-medium text-base-content/70 mb-2">
        {{ $t('taskList.selectSprintToView') }}
      </h3>
      <p class="text-base-content/50">
        {{ $t('taskList.selectSprintDescription') }}
      </p>
    </div>

    <!-- Floating Add Button -->
    <AppAddBtn v-if="selectedSprintId" @click="handleAdd" />

    <!-- Drawer -->
    <AppDrawerRight
      v-model="openDrawer"
      :title="selectedTask ? $t('taskList.editTask') : $t('taskList.addTask')"
    >
      <LazyTaskForm
        v-if="openDrawer"
        ref="taskForm"
        :initial-data="selectedTask"
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
          @click="taskForm?.triggerSubmit()"
        >
          {{ $t('save') }}
        </AppButton>
      </template>
    </AppDrawerRight>
  </section>
</template>

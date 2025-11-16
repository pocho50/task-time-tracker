<script setup lang="ts">
import type { SerializedTaskWithUsersAndTimeTracks } from '../shared/types';

const props = defineProps<{
  tasks: SerializedTaskWithUsersAndTimeTracks[];
}>();

const showTimetrackHistory = ref(false);
const selectedTaskId = ref<string | null>(null);

const editSessionModal = useTemplateRef('editSessionModal');

// Get the updated task from props.tasks to reflect changes
const selectedTask = computed(() => {
  if (!selectedTaskId.value) return null;
  return props.tasks.find((task) => task.id === selectedTaskId.value) || null;
});

const handleHistory = (task: SerializedTaskWithUsersAndTimeTracks) => {
  showTimetrackHistory.value = true;
  selectedTaskId.value = task.id;
};

const session = ref<SerializedTimeTrackWithUser | null>(null);

const handleEditTimeTrack = async (timeTrack: SerializedTimeTrackWithUser) => {
  session.value = timeTrack;
  await nextTick();
  editSessionModal.value?.handleOpenEditSession();
};
</script>
<template>
  <div
    class="overflow-x-auto w-full bg-base-100 h-full pt-12"
    data-testid="task-list"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>{{ $t('taskList.name') }}</th>
          <th>{{ $t('taskList.priority') }}</th>
          <th>{{ $t('taskList.status') }}</th>
          <th>{{ $t('taskList.assignedUsers') }}</th>
          <th></th>
          <th class="w-28">{{ $t('taskList.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="tasks && tasks.length">
          <TaskListItem
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @@history="handleHistory"
          />
        </template>
        <template v-else>
          <tr>
            <td colspan="6" class="text-center py-8 text-gray-500">
              <Icon
                name="mdi:clipboard-list-outline"
                size="48"
                class="mx-auto mb-2"
              />
              <div>{{ $t('taskList.noTasks') }}</div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!--  Drawer for view history -->
  <AppDrawerRight v-model="showTimetrackHistory" size="lg">
    <TaskHistory
      v-if="selectedTask"
      :task="selectedTask"
      @@edit="handleEditTimeTrack"
    />
  </AppDrawerRight>

  <TaskTimeTrackEdit
    ref="editSessionModal"
    v-if="session && selectedTask"
    :task="selectedTask"
    :session="session"
  />
</template>

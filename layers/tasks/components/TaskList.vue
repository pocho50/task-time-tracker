<script setup lang="ts">
import type { SerializedTaskWithUsersAndTimeTracks } from '../shared/types';

const props = defineProps<{
  tasks: SerializedTaskWithUsersAndTimeTracks[];
  onEdit?: (id: string) => void;
  onRefresh?: () => Promise<void>;
}>();
</script>
<template>
  <div
    class="overflow-x-auto w-full bg-base-100 h-full pt-4"
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
            :on-edit="onEdit"
            :on-refresh="onRefresh"
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
</template>

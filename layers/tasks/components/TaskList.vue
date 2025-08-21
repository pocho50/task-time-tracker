<script setup lang="ts">
import type { TaskStatus, TaskPriority } from '@prisma/client';

const STATUS_VARIANTS: Record<
  TaskStatus,
  'info' | 'success' | 'warning' | 'error'
> = {
  ANALYZING: 'warning',
  IN_PROGRESS: 'info',
  APPROVED: 'success',
  FINALIZED: 'success',
};

const PRIORITY_VARIANTS: Record<
  TaskPriority,
  'info' | 'success' | 'warning' | 'error'
> = {
  LOW: 'info',
  MEDIUM: 'warning',
  HIGH: 'error',
};

const props = defineProps<{
  tasks: SerializedTaskWithUsers[];
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
}>();

const getStatusVariant = (status: TaskStatus) => {
  return STATUS_VARIANTS[status];
};

const getPriorityVariant = (priority: TaskPriority) => {
  return PRIORITY_VARIANTS[priority];
};
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
          <th class="w-28">{{ $t('taskList.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="tasks && tasks.length">
          <tr v-for="task in tasks" :key="task.id" class="hover">
            <!-- Name -->
            <td>
              <div class="font-bold">{{ task.name }}</div>
              <div v-if="task.description" class="text-sm text-gray-500">
                {{ task.description }}
              </div>
            </td>
            <!-- Priority -->
            <td>
              <AppBadge
                :variant="getPriorityVariant(task.priority)"
                :size="'sm'"
              >
                {{ task.priority }}
              </AppBadge>
            </td>
            <!-- Status -->
            <td>
              <AppBadge :variant="getStatusVariant(task.status)" :size="'sm'">
                {{ task.status }}
              </AppBadge>
            </td>

            <!-- Actions -->
            <td>
              <div
                v-if="onEdit || onRemove"
                :data-testid="`task-actions-${task.id}`"
              >
                <AppOptionAction
                  :actions="['edit', 'remove']"
                  @edit="onEdit?.(task.id)"
                  @remove="onRemove?.(task.id)"
                  class="relative dropdown-top !right-0 !top-0"
                />
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="7" class="text-center py-8 text-gray-500">
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

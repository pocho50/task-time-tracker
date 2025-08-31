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
  task: SerializedTaskWithUsers;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
}>();

const emit = defineEmits<{
  edit: [id: string];
  remove: [id: string];
}>();

const getStatusVariant = (status: TaskStatus) => {
  return STATUS_VARIANTS[status];
};

const getPriorityVariant = (priority: TaskPriority) => {
  return PRIORITY_VARIANTS[priority];
};
</script>

<template>
  <tr class="hover">
    <!-- Name -->
    <td>
      <div class="font-bold">{{ task.name }}</div>
      <div v-if="task.description" class="text-sm text-gray-500">
        {{ task.description }}
      </div>
    </td>
    <!-- Priority -->
    <td>
      <AppBadge :variant="getPriorityVariant(task.priority)" :size="'sm'">
        {{ task.priority }}
      </AppBadge>
    </td>
    <!-- Status -->
    <td>
      <AppBadge :variant="getStatusVariant(task.status)" :size="'sm'">
        {{ task.status }}
      </AppBadge>
    </td>
    <td>
      <!-- Task time -->
      <TaskTime />
    </td>
    <!-- Actions -->
    <td>
      <div v-if="onEdit || onRemove" :data-testid="`task-actions-${task.id}`">
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

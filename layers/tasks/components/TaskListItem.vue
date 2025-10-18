<script setup lang="ts">
import type { TaskStatus, TaskPriority } from '@prisma/client';
import type { SerializedTaskWithUsersAndTimeTracks } from '../shared/types';

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
  task: SerializedTaskWithUsersAndTimeTracks;
  onEdit?: (id: string) => void;
  onRefresh?: () => Promise<void>;
}>();

const emit = defineEmits<{
  '@history': [task: SerializedTaskWithUsersAndTimeTracks];
}>();

const getStatusVariant = (status: TaskStatus) => {
  return STATUS_VARIANTS[status];
};

const getPriorityVariant = (priority: TaskPriority) => {
  return PRIORITY_VARIANTS[priority];
};

const {
  currentTimeTrackSession,
  getTimeAccumulatedSeconds,
  handleStart,
  handleEnd,
} = useTaskTimeTracks(props.task, props.onRefresh);

const timeAccumulateSeconds = useState<number>(
  `timeAccumulateSeconds-${props.task.id}`,
  () => getTimeAccumulatedSeconds.value
);

onMounted(() => {
  timeAccumulateSeconds.value = getTimeAccumulatedSeconds.value;
});
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
    <!-- Assigned Users -->
    <td>
      <TaskAssignedUsers :users="task.users" />
    </td>
    <td>
      <!-- Task time -->
      <TaskTime
        :accumulatedSeconds="timeAccumulateSeconds"
        :startInmediate="currentTimeTrackSession !== null"
        @@start="handleStart"
        @@end="handleEnd"
      />
    </td>
    <!-- Actions -->
    <td>
      <div v-if="onEdit" :data-testid="`task-actions-${task.id}`">
        <TaskOptionActions
          @@edit="onEdit?.(task.id)"
          @@history="$emit('@history', task)"
          class="relative dropdown-top !right-0 !top-0"
        />
      </div>
    </td>
  </tr>
</template>

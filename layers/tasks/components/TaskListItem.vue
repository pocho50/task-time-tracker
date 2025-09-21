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

const {
  currentTimeTrackSession,
  getTimeAccumulatedSeconds,
  handleStart,
  handleEnd,
} = await useTaskTimeTracks(props.task.id);

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
        <AppOptionAction
          :actions="['edit']"
          @@edit="onEdit?.(task.id)"
          class="relative dropdown-top !right-0 !top-0"
        />
      </div>
    </td>
  </tr>
</template>

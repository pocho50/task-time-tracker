<script setup lang="ts">
import type { TaskStatus, TaskPriority } from '@prisma/client';
import type { SerializedTaskWithUsersAndTimeTracks } from '../shared/types';
import { truncateHtmlText } from '../utils/truncateHtmlText';

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
}>();

// Inject handlers from parent context
const { handleEdit, handleRefresh, handleRemove } = useTasksContext();

const emit = defineEmits<{
  '@history': [task: SerializedTaskWithUsersAndTimeTracks];
}>();

const getStatusVariant = (status: TaskStatus) => {
  return STATUS_VARIANTS[status];
};

const getPriorityVariant = (priority: TaskPriority) => {
  return PRIORITY_VARIANTS[priority];
};

const editSessionModal = useTemplateRef('editSessionModal');

const {
  currentTimeTrackSession,
  getTimeAccumulatedSeconds,
  getActiveSessionElapsedSeconds,
  handleStart,
  handleEnd,
  getLastSession,
  checkActiveSessionAndSetLastSession,
} = useTaskTimeTracks(toRef(props, 'task'), handleRefresh);

const timeAccumulateSeconds = useState<number>(
  `timeAccumulateSeconds-${props.task.id}`,
  () => getTimeAccumulatedSeconds.value
);

// Watch for changes in accumulated time and update the state
watch(
  getTimeAccumulatedSeconds,
  (newValue) => {
    timeAccumulateSeconds.value = newValue;
  },
  { immediate: true }
);

// Strip HTML tags and truncate description to 100 characters
const truncatedDescription = computed(() => {
  return truncateHtmlText(props.task.description ?? '', 100);
});
</script>

<template>
  <tr class="hover" data-testid="task-row">
    <!-- Name -->
    <td>
      <div class="font-bold">
        {{ task.name }}
      </div>
      <div v-if="truncatedDescription" class="text-sm text-gray-500">
        {{ truncatedDescription }}
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
      <div class="flex items-center gap-2">
        <TaskTime
          :accumulated-seconds="timeAccumulateSeconds"
          :initial-seconds="getActiveSessionElapsedSeconds"
          :start-inmediate="currentTimeTrackSession !== null"
          @@start="handleStart"
          @@end="handleEnd"
        />
        <button
          v-if="getLastSession"
          type="button"
          class="btn btn-ghost btn-xs"
          :aria-label="$t('common.edit')"
          data-testid="edit-active-session-button"
          @click="editSessionModal?.handleOpenEditSession"
        >
          <Icon name="mdi:pencil" size="16" />
        </button>
      </div>
    </td>
    <!-- Actions -->
    <td>
      <div :data-testid="`task-actions-${task.id}`">
        <TaskOptionActions
          class="relative dropdown-top !right-0 !top-0"
          @@edit="handleEdit(task.id)"
          @@remove="handleRemove(task.id)"
          @@history="$emit('@history', task)"
        />
      </div>
    </td>
  </tr>

  <!-- Edit Session Modal -->
  <TaskTimeTrackEdit
    v-if="getLastSession"
    ref="editSessionModal"
    :task="task"
    :session="getLastSession"
  />
</template>

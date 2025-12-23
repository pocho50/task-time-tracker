<script setup lang="ts">
import type { SerializedTaskWithUsersAndTimeTracks } from '../shared/types';
import { getDiffTime } from '~/layers/shared/utils/dateUtils';

const props = defineProps<{
  task: SerializedTaskWithUsersAndTimeTracks | null;
}>();

const emit = defineEmits<{
  '@edit': [timeTrack: SerializedTimeTrackWithUser];
}>();

const getTimeTracksNotes = computed(() => {
  if (!props.task) return [];
  return props.task.timeTracking;
});

const handleEdit = (timeTrack: SerializedTimeTrackWithUser) => {
  emit('@edit', timeTrack);
};

const { isUserAssignedToTask } = useIsUserAssignedToTask(toRef(props, 'task'));
</script>
<template>
  <div>
    <!-- Empty state -->
    <AppEmptyState v-if="getTimeTracksNotes.length === 0">
      <template #title>{{ $t('taskHistory.noHistory') }}</template>
      {{ $t('taskHistory.noHistoryDescription') }}
    </AppEmptyState>

    <!-- Time tracking history list -->
    <ul v-else class="space-y-3">
      <li
        v-for="timeTrack in getTimeTracksNotes"
        :key="timeTrack.id"
        class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div class="card-body p-4">
          <!-- User info header -->
          <div class="flex items-center gap-3 mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-base">{{ timeTrack.user.name }}</h3>
              <p class="text-xs text-base-content/60">
                {{ timeTrack.user.email }}
              </p>
            </div>
            <!-- Status badge and actions -->
            <div class="flex items-center gap-2">
              <span
                v-if="!timeTrack.end"
                class="badge badge-success badge-sm gap-1"
              >
                <Icon name="mdi:clock-outline" class="text-xs" />
                {{ $t('taskHistory.active') }}
              </span>
              <span v-else class="badge badge-ghost badge-sm gap-1">
                <Icon name="mdi:check-circle-outline" class="text-xs" />
                {{ $t('taskHistory.completed') }}
              </span>
              <!-- Edit button -->
              <button
                v-if="isUserAssignedToTask"
                type="button"
                class="btn btn-ghost btn-xs btn-square"
                :title="$t('taskHistory.editSession')"
                :data-testid="`edit-history-session-button-${timeTrack.id}`"
                @click="handleEdit(timeTrack)"
              >
                <Icon name="mdi:pencil" class="text-base" />
              </button>
            </div>
          </div>

          <!-- Time information -->
          <div class="grid grid-cols-2 gap-3 mb-3">
            <!-- Start time -->
            <div class="flex flex-col">
              <span
                class="text-xs text-base-content/60 mb-1 flex items-center gap-1"
              >
                <Icon name="mdi:play-circle-outline" class="text-sm" />
                {{ $t('taskHistory.start') }}
              </span>
              <span class="text-sm font-medium">
                <AppDateTime :datetime="timeTrack.start" />
              </span>
            </div>

            <!-- End time -->
            <div class="flex flex-col">
              <span
                class="text-xs text-base-content/60 mb-1 flex items-center gap-1"
              >
                <Icon name="mdi:stop-circle-outline" class="text-sm" />
                {{ $t('taskHistory.end') }}
              </span>
              <span v-if="timeTrack.end" class="text-sm font-medium">
                <AppDateTime :datetime="timeTrack.end" />
              </span>
              <span v-else class="text-sm italic text-base-content/40">
                {{ $t('taskHistory.inProgress') }}
              </span>
            </div>
          </div>

          <!-- Duration section (only for completed sessions) -->
          <div v-if="timeTrack.end" class="alert alert-info py-2 px-3 mb-3">
            <Icon name="mdi:timer-outline" class="text-lg" />
            <div class="flex-1">
              <span class="text-xs font-medium"
                >{{ $t('taskHistory.duration') }}:</span
              >
              <span class="text-sm font-bold ml-2">
                {{ getDiffTime(timeTrack.start, timeTrack.end) }}
              </span>
            </div>
          </div>

          <!-- Notes section -->
          <div
            v-if="timeTrack.notes"
            class="mt-2 pt-3 border-t border-base-300"
          >
            <div class="flex items-start gap-2">
              <Icon
                name="mdi:note-text-outline"
                class="text-base text-base-content/60 mt-0.5"
              />
              <div class="flex-1">
                <p class="text-xs text-base-content/60 mb-1">
                  {{ $t('taskHistory.notes') }}
                </p>
                <p class="text-sm">{{ timeTrack.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Empty notes state -->
          <div v-else class="mt-2 pt-3 border-t border-base-300">
            <div class="flex items-center gap-2 text-base-content/40">
              <Icon name="mdi:note-off-outline" class="text-base" />
              <p class="text-xs italic">{{ $t('taskHistory.noNotesAdded') }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

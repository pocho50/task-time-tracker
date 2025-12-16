<script setup lang="ts">
import type { SerializedWorkingSession } from '../shared/types';

const props = defineProps<{
  sessions: SerializedWorkingSession[];
}>();
</script>

<template>
  <div
    class="overflow-x-auto w-full bg-base-100 h-full pt-12"
    data-testid="working-task-list"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>{{ $t('taskList.name') }}</th>
          <th class="hidden md:table-cell">{{ $t('taskList.project') }}</th>
          <th>{{ $t('taskList.sprint') }}</th>
          <th>{{ $t('taskList.workingUser') }}</th>
          <th>{{ $t('taskHistory.duration') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="sessions && sessions.length">
          <WorkingTaskListItem
            v-for="session in sessions"
            :key="session.id"
            :session="session"
          />
        </template>
        <template v-else>
          <tr>
            <td colspan="5" class="text-center py-8 text-gray-500">
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

<script setup lang="ts">
import type { SerializedWorkingSession } from '../shared/types';
import { truncateHtmlText } from '../utils/truncateHtmlText';

const props = defineProps<{
  session: SerializedWorkingSession;
}>();

const workingUserLabel = computed(() => {
  const { name, email } = props.session.user;
  return name || email;
});

const initialSeconds = computed(() => {
  const start = new Date(props.session.start).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / 1000));
});

const truncatedDescription = computed(() => {
  return truncateHtmlText(props.session.task.description ?? '', 100);
});
</script>

<template>
  <tr class="hover" data-testid="working-task-row">
    <td>
      <div class="font-bold">
        {{ session.task.name }}
      </div>
      <div v-if="truncatedDescription" class="text-sm text-gray-500">
        {{ truncatedDescription }}
      </div>
    </td>

    <td>
      <span class="text-sm">
        {{ session.task.project.name }}
      </span>
    </td>

    <td>
      <span class="text-sm">
        <NuxtLink
          v-if="session.task.sprint"
          class="link link-primary"
          :to="{
            path: `/tasks/${session.task.sprint.id}`,
            query: { idProject: session.task.project.id },
          }"
        >
          {{ session.task.sprint.name }}
        </NuxtLink>
        <span v-else>-</span>
      </span>
    </td>

    <td>
      <span class="text-sm">
        {{ workingUserLabel }}
      </span>
    </td>

    <td class="w-1 whitespace-nowrap">
      <div class="inline-flex">
        <TaskTime
          :accumulated-seconds="session.accumulatedSeconds"
          :initial-seconds="initialSeconds"
          :start-inmediate="true"
          read-only
        />
      </div>
    </td>
  </tr>
</template>

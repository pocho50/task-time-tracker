<script setup lang="ts">
import type { Sprint } from '../utils';
import { formatDate } from '#layers/shared/utils';

const VARIANTS: Record<SprintStatus, 'info' | 'success' | 'warning'> = {
  PLANNING: 'warning',
  ACTIVE: 'info',
  COMPLETED: 'success',
};

const props = defineProps<{
  sprints: Sprint[];
}>();

// Inject handlers from parent context
const { handleEdit, handleRemove } = useSprintsContext();

const getVariant = (status: SprintStatus) => {
  return VARIANTS[status];
};
</script>

<template>
  <div
    class="overflow-x-auto w-full bg-base-100 h-full pt-4"
    data-testid="sprint-list"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>{{ $t('sprintList.name') }}</th>
          <th>{{ $t('sprintList.startDate') }}</th>
          <th>{{ $t('sprintList.endDate') }}</th>
          <th>{{ $t('sprintList.status') }}</th>
          <th>{{ $t('sprintList.tasks') }}</th>
          <th class="w-28">{{ $t('sprintList.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="sprints && sprints.length">
          <tr
            v-for="sprint in sprints"
            :key="sprint.id"
            class="hover"
            data-testid="sprint-list-item"
          >
            <!-- Name -->
            <td>
              <div class="font-bold">{{ sprint.name }}</div>
            </td>
            <!-- Start Date -->
            <td>
              <div>{{ formatDate(sprint.startDate) }}</div>
            </td>
            <!-- End Date -->
            <td>
              <div>{{ formatDate(sprint.endDate) }}</div>
            </td>
            <!-- Status -->
            <td>
              <div>
                <AppBadge :variant="getVariant(sprint.status)" :size="'sm'">
                  {{ sprint.status }}
                </AppBadge>
              </div>
            </td>
            <!-- Tasks -->
            <td>
              <NuxtLink
                :to="{
                  name: 'tasks-idSprint',
                  params: { idSprint: sprint.id },
                }"
              >
                <Icon name="mdi:calendar-task" size="24" />
              </NuxtLink>
            </td>
            <!-- Actions -->
            <td>
              <div :data-testid="`sprint-actions-${sprint.id}`">
                <AppOptionAction
                  :actions="['edit', 'remove']"
                  @@edit="handleEdit(sprint.id)"
                  @@remove="handleRemove(sprint.id)"
                  class="relative dropdown-top !right-0 !top-0"
                />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

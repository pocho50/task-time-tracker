<script setup lang="ts">
import type { Sprint } from '../utils';
import { formatDate } from '#layers/shared/utils';

const props = defineProps<{
  sprints: Sprint[];
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
}>();
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
          <th class="w-28">{{ $t('sprintList.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="sprints && sprints.length">
          <tr v-for="sprint in sprints" :key="sprint.id" class="hover">
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
                <span class="badge badge-accent badge-sm">{{
                  sprint.status
                }}</span>
              </div>
            </td>
            <!-- Actions -->
            <td>
              <div
                v-if="onEdit || onRemove"
                :data-testid="`sprint-actions-${sprint.id}`"
              >
                <AppOptionAction
                  :actions="[
                    ...(onEdit ? ['edit' as const] : []),
                    ...(onRemove ? ['remove' as const] : []),
                  ]"
                  @edit="onEdit?.(sprint.id)"
                  @remove="onRemove?.(sprint.id)"
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

<script setup lang="ts">
import type { User } from '@prisma/client';

const props = defineProps<{
  users: Pick<User, 'id' | 'name' | 'email'>[];
}>();

// Extract user names directly from the provided users data
const assignedUsers = computed(() => {
  return props.users?.map(user => user.name) ?? [];
});
</script>

<template>
  <div v-if="assignedUsers.length > 0" class="flex flex-wrap gap-1">
    <span
      v-for="userName in assignedUsers"
      :key="userName"
      class="badge badge-outline badge-sm"
    >
      {{ userName }}
    </span>
  </div>
  <span v-else class="text-gray-400 text-sm">
    {{ $t('taskList.noUsersAssigned') }}
  </span>
</template>

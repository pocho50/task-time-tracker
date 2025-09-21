<script setup lang="ts">
const props = defineProps<{
  usersId: string[];
}>();

// Get users data to display assigned users
const { users } = useUsers();

// Compute assigned users names
const assignedUsers = computed(() => {
  if (!props.usersId || props.usersId.length === 0) {
    return [];
  }
  return users.value
    ?.filter(user => props.usersId.includes(user.id))
    .map(user => user.name) ?? [];
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

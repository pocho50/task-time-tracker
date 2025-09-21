<script setup lang="ts">
const { users } = useUsers();
const selectedUsers = inject<Ref<string[]>>('selectedUsers');

const userOptions = computed(() => 
  users.value?.map(user => ({
    value: user.id,
    label: user.name
  })) ?? []
);
</script>

<template>
  <AppMultiSelect
    v-model="selectedUsers"
    :options="userOptions"
    :placeholder="$t('taskForm.selectUsers')"
    :label="$t('taskForm.assignedUsers')"
  />
</template>

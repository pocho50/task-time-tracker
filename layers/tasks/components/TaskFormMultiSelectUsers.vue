<script setup lang="ts">
const { users } = useUsers();
const selectedUsers = inject<Ref<string[]>>('selectedUsers');

const userOptions = computed(
  () =>
    users.value?.map((user) => ({
      value: user.id,
      label: user.name,
    })) ?? []
);
</script>

<template>
  <div data-testid="users-multi-select">
    <AppMultiSelect
      v-model="selectedUsers"
      :options="userOptions"
      :placeholder="$t('taskForm.selectUsers')"
      :label="$t('taskForm.assignedUsers')"
    />
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '~/layers/users/composables/useUsers';

const selectedUsers: Ref<string[]> = inject('selectedUsers')!;

const { users } = useUsers();

const getUsersForMultiSelect = () => {
  return (
    users.value?.map((user) => ({
      label: user.name,
      value: user.id,
    })) ?? []
  );
};
</script>

<template>
  <!-- Multi select users -->
  <AppMultiSelect
    v-model="selectedUsers"
    :options="getUsersForMultiSelect()"
    :label="$t('multiSelect.assignUsersToProject')"
    :placeholder="$t('multiSelect.placeholder')"
  />
</template>

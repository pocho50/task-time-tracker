<script setup lang="ts">
import { UserRepo } from '~/layers/users/repository/userRepo';

const selectedUsers: Ref<string[]> = inject('selectedUsers')!;
// get users
const { $api } = useNuxtApp();
const userRepo = new UserRepo($api);
const { data: users } = useAsyncData('users', () => userRepo.getAll());

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

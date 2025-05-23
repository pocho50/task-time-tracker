<script setup lang="ts">
const { users, status } = useUsers();

const handleEdit = (id: string) => {
  // Implement edit functionality here
  console.log('Edit user with ID:', id);
};

const handleRemove = (id: string) => {
  // Implement remove functionality here
  console.log('Remove user with ID:', id);
};
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle :text="$t('userList.title')" />
    <UserList :users="users ?? []" />
    <AppEmptyState
      v-if="(!users || users.length === 0) && status === 'success'"
    >
      <template #title>{{ $t('userList.noUsersFound') }}</template>
      {{ $t('userList.noUsersFoundDescription') }}
    </AppEmptyState>
  </section>
</template>

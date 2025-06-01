<script setup lang="ts">
const {
  users,
  refresh,
  status,
  openDrawer,
  selectedUser,
  isCreate,
  handleAdd,
  handleEdit,
  handleSave,
  handleRemove,
} = useUsers();

// form template refs
const userForm = useTemplateRef('userForm');
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle :text="$t('userList.title')" />
    <UserList
      :users="users ?? []"
      :onEdit="handleEdit"
      :onRemove="handleRemove"
    />
    <AppEmptyState
      v-if="(!users || users.length === 0) && status === 'success'"
    >
      <template #title>{{ $t('userList.noUsersFound') }}</template>
      {{ $t('userList.noUsersFoundDescription') }}
    </AppEmptyState>
    <AppAddBtn @click="handleAdd" />
    <AppDrawerRight
      v-model="openDrawer"
      :title="isCreate ? $t('userList.addUser') : $t('userList.editUser')"
    >
      <LazyUserForm
        v-if="openDrawer"
        :initial-data="selectedUser"
        :is-create="isCreate"
        @@submit="handleSave"
        ref="userForm"
      />
      <template #actions>
        <AppButton
          type="button"
          variant="default"
          size="lg"
          @click="openDrawer = false"
        >
          {{ $t('cancel') }}
        </AppButton>
        <AppButton
          data-testid="user-form-submit"
          type="button"
          variant="primary"
          size="lg"
          @click="userForm?.triggerSubmit()"
        >
          {{ $t('save') }}
        </AppButton>
      </template>
    </AppDrawerRight>
  </section>
</template>

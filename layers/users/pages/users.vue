<script setup lang="ts">
const {
  users,
  pagination,
  page,
  status,
  openDrawer,
  selectedUser,
  isCreate,
  handleAdd,
  handleEdit,
  handleSave,
  handleRemove,
} = useUsers();

// Provide context to child components
provideUsersContext({
  handleEdit,
  handleRemove,
});

// form template refs
const userForm = useTemplateRef('userForm');

const { userIsAllowedToWrite } = useUser();
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
    <!-- Pagination -->
    <AppPagination
      v-if="pagination && pagination.pageCount > 1"
      :page="page"
      :total-pages="pagination.pageCount"
      @@prev="page--"
      @@next="page++"
    />
    <AppAddBtn
      @click="handleAdd"
      v-if="userIsAllowedToWrite(ALL_ENTITIES.USERS)"
    />
    <AppDrawerRight
      v-model="openDrawer"
      :title="isCreate ? $t('userList.addUser') : $t('userList.editUser')"
    >
      <LazyUserForm
        v-if="openDrawer"
        ref="userForm"
        :initial-data="selectedUser"
        :is-create="isCreate"
        @@submit="handleSave"
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

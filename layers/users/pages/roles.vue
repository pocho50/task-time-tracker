<script setup lang="ts">
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { useUser } from '#layers/shared/composables/useUser';
import { provideRolesContext } from '../composables/useRolesContext';

const {
  roles,
  status,
  openDrawer,
  selectedRole,
  isCreate,
  handleAdd,
  handleEdit,
  handleSave,
  handleRemove,
} = useRoles();

const roleForm = useTemplateRef('roleForm');

const { userIsAllowedToWrite } = useUser();

provideRolesContext({
  handleEdit,
  handleRemove,
});
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle :text="$t('roleList.title')" />

    <RoleList :roles="roles" />

    <AppEmptyState v-if="roles.length === 0 && status === 'success'">
      <template #title>{{ $t('roleList.noRolesFound') }}</template>
      {{ $t('roleList.noRolesFoundDescription') }}
    </AppEmptyState>

    <AppAddBtn
      v-if="userIsAllowedToWrite(ALL_ENTITIES.ROLES)"
      @click="handleAdd"
    />

    <AppDrawerRight
      v-model="openDrawer"
      :title="isCreate ? $t('roleForm.title') : $t('roleForm.title')"
    >
      <LazyRoleForm
        v-if="openDrawer"
        ref="roleForm"
        :initial-data="selectedRole"
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
          type="button"
          variant="primary"
          size="lg"
          @click="roleForm?.triggerSubmit()"
        >
          {{ $t('save') }}
        </AppButton>
      </template>
    </AppDrawerRight>
  </section>
</template>

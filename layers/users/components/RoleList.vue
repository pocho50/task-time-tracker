<script setup lang="ts">
import type { RoleDto } from '../repository/roleRepo';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import type { OptionAction } from '#layers/shared/utils/optionActions';

defineProps<{
  roles: RoleDto[];
}>();

const { handleEdit, handleRemove } = useRolesContext();
const { userIsAllowedToWrite, userIsAllowedToDelete } = useUser();

const availableActions = computed<OptionAction[]>(() => {
  const actions: OptionAction[] = [];

  if (userIsAllowedToWrite(ALL_ENTITIES.ROLES)) actions.push('edit');
  if (userIsAllowedToDelete(ALL_ENTITIES.ROLES)) actions.push('remove');

  return actions;
});
</script>

<template>
  <div
    class="overflow-x-auto w-full bg-base-100 h-full pt-4"
    data-testid="role-list"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>{{ $t('roleList.role') }}</th>
          <th>{{ $t('roleList.name') }}</th>
          <th class="w-28">{{ $t('roleList.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="roles && roles.length">
          <tr v-for="role in roles" :key="role.key" class="hover">
            <td>
              <div class="font-mono font-semibold">{{ role.key }}</div>
            </td>
            <td>
              <div class="font-medium">{{ role.name }}</div>
            </td>
            <td>
              <div :data-testid="`role-actions-${role.key}`">
                <AppOptionAction
                  v-if="
                    userIsAllowedToWrite(ALL_ENTITIES.ROLES) ||
                    userIsAllowedToDelete(ALL_ENTITIES.ROLES)
                  "
                  :actions="availableActions"
                  class="relative dropdown-top !right-0 !top-0"
                  @@edit="handleEdit(role.key)"
                  @@remove="handleRemove(role.key)"
                />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

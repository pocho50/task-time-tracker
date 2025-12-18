<script setup lang="ts">
import type { User } from '../utils/index';
import { ROLES } from '#layers/shared/utils/constants';
const props = defineProps<{
  users: User[];
}>();

// Inject handlers from parent context
const { handleEdit, handleRemove } = useUsersContext();

const getVariant = (role: string) => {
  return role === ROLES.ADMIN ? 'success' : 'info';
};
</script>

<template>
  <div
    class="overflow-x-auto w-full bg-base-100 h-full pt-4"
    data-testid="user-list"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th class="w-16 hidden lg:table-cell" />
          <th>{{ $t('userList.name') }}</th>
          <th>{{ $t('userList.email') }}</th>
          <th>{{ $t('userList.role') }}</th>
          <th class="w-28">{{ $t('userList.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="users && users.length">
          <tr v-for="user in users" :key="user.id" class="hover">
            <!-- Avatar -->
            <td class="w-16 hidden lg:table-cell">
              <div class="avatar avatar-placeholder">
                <div class="bg-neutral text-neutral-content w-16 rounded-full">
                  <span class="text-3xl">{{
                    user.name.charAt(0).toUpperCase()
                  }}</span>
                </div>
              </div>
            </td>
            <!-- Name -->
            <td>
              <div class="font-bold">{{ user.name }}</div>
            </td>
            <!-- Email -->
            <td>
              <div>{{ user.email }}</div>
            </td>
            <!-- Role -->
            <td>
              <AppBadge :variant="getVariant(user.role)">
                {{ user.role }}
              </AppBadge>
            </td>
            <!-- Actions -->
            <td>
              <div :data-testid="`user-actions-${user.id}`">
                <AppOptionAction
                  :actions="['edit', 'remove']"
                  class="relative dropdown-top !right-0 !top-0"
                  @@edit="handleEdit(user.id)"
                  @@remove="handleRemove(user.id)"
                />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

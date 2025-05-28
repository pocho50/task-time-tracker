<script setup lang="ts">
import type { User } from '../utils/index';
const props = defineProps<{
  users: User[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}>();
</script>

<template>
  <div
    class="overflow-x-auto w-full bg-base-100 h-full pt-4"
    data-testid="user-list"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th class="w-16 hidden lg:table-cell"></th>
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
              <div>
                <span class="badge badge-accent badge-sm">{{ user.role }}</span>
              </div>
            </td>
            <!-- Actions -->
            <td>
              <div>
                <AppOptionAction
                  :actions="['edit', 'remove']"
                  @@edit="onEdit(user.id)"
                  class="relative dropdown-top !right-0 !top-0"
                />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { RoleDto } from '../repository/roleRepo';

defineProps<{
  roles: RoleDto[];
}>();
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
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

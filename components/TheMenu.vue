<script setup lang="ts">
import { useUser } from '#layers/shared/composables/useUser';
import { ALL_ENTITIES } from '~/layers/shared/utils/constants';
import { hasPermission, PERMISSIONS } from '~/layers/shared/utils/permissions';

const rawMenuItems = [
  {
    to: '/projects',
    icon: 'mdi:view-dashboard',
    label: 'app.menu.projects',
    entity: ALL_ENTITIES.PROJECTS,
  },
  {
    to: '/tasks',
    icon: 'mdi:timer',
    label: 'app.menu.tasks',
    entity: ALL_ENTITIES.TASKS,
  },
  {
    to: '/tasks/working',
    icon: 'mdi:fire',
    label: 'app.menu.tasksOnWorking',
    entity: ALL_ENTITIES.WORKING,
    permission: PERMISSIONS.WORKING_READ,
  },
  {
    to: '/users',
    icon: 'mdi:users',
    label: 'app.menu.users',
    entity: ALL_ENTITIES.USERS,
    permission: PERMISSIONS.USERS_READ,
  },
  {
    to: '/roles',
    icon: 'mdi:account-key',
    label: 'app.menu.roles',
    entity: ALL_ENTITIES.ROLES,
    permission: PERMISSIONS.ROLES_READ,
  },
  {
    to: '/settings',
    icon: 'mdi:account',
    label: 'app.menu.settings',
  },
];

const { user } = useUser();
const { permissions } = usePermissions();

const menuItems = computed(() =>
  rawMenuItems.filter((item) => {
    if ('permission' in item && item.permission) {
      return hasPermission(permissions.value ?? {}, {
        entity: item.entity,
        permission: item.permission,
      });
    }
    return true;
  })
);
</script>

<template>
  <ul class="menu menu-lg p-4 w-full flex-1 gap-2" data-testid="menu">
    <li v-for="item in menuItems" :key="item.to">
      <NuxtLink :to="item.to" class="flex items-center gap-3">
        <Icon :name="item.icon" size="18" />
        <span>{{ $t(item.label) }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

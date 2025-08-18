<script setup lang="ts">
import { useUser } from '#layers/shared/composables/useUser';
import { ALL_ENTITIES } from '~/layers/shared/utils/constants';

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
  },
  {
    to: '/users',
    icon: 'mdi:users',
    label: 'app.menu.users',
    requiresWrite: true,
    entity: ALL_ENTITIES.USERS,
  },
  {
    to: '/settings',
    icon: 'mdi:account',
    label: 'app.menu.settings',
  },
];

const { userIsAllowedToWrite } = useUser();

const menuItems = computed(() =>
  rawMenuItems.filter(
    (item) => !item.requiresWrite || userIsAllowedToWrite(item.entity)
  )
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

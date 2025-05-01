<script setup lang="ts">
const menuItems = [
  {
    to: "/projects",
    icon: "mdi:view-dashboard",
    label: "app.menu.projects",
  },
  {
    to: "/tracker",
    icon: "mdi:timer",
    label: "app.menu.tasks",
  },
  {
    to: "/profile",
    icon: "mdi:account",
    label: "app.menu.settings",
  },
];
</script>

<template>
  <ul class="menu menu-lg p-4 w-full flex-1 gap-2">
    <li v-for="item in menuItems" :key="item.to">
      <NuxtLink :to="item.to" class="flex items-center gap-3">
        <Icon :name="item.icon" size="18" />
        <span>{{ $t(item.label) }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

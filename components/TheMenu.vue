<script setup lang="ts">
const menuItems = [
  {
    to: "/projects",
    icon: "mdi:view-dashboard",
    label: "Projects",
  },
  {
    to: "/tracker",
    icon: "mdi:timer",
    label: "Time Tracker",
  },
  {
    to: "/profile",
    icon: "mdi:account",
    label: "Profile",
  },
];
</script>

<template>
  <ul class="menu menu-lg p-4 w-full flex-1 gap-2">
    <li v-for="item in menuItems" :key="item.to">
      <NuxtLink :to="item.to" class="flex items-center gap-3">
        <Icon :name="item.icon" size="18" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineEmits(['@toogleDrawer']);

const isDark = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'business',
  valueLight: 'corporate',
});
</script>
<template>
  <nav
    class="bg-base-100 flex items-center text-base-content p-4 shadow-xs gap-4 z-10 relative"
  >
    <button
      class="btn btn-ghost hidden lg:inline-flex"
      @click="$emit('@toogleDrawer')"
    >
      <Icon name="mdi:menu" size="24" />
    </button>
    <label for="main-drawer" class="btn btn-ghost lg:hidden drawer-button">
      <Icon name="mdi:menu" size="24" />
    </label>
    <h1 class="text-xl font-bold flex-1">Task Time Tracker</h1>
    <button
      class="btn btn-ghost"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="isDark = !isDark"
    >
      <Icon v-show="isDark" name="mdi:weather-night" size="24" />
      <Icon v-show="!isDark" name="mdi:weather-sunny" size="24" />
    </button>
  </nav>
</template>

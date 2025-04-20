<script setup lang="ts">
const open = defineModel<boolean>();

defineProps<{ title?: string }>();
const closeDrawer = () => {
  open.value = false;
};
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div
      v-if="open"
      @click="closeDrawer"
      :class="{ 'drawer-right-overlay': open }"
      class="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out z-40"
    />

    <!-- Drawer -->
    <aside
      class="fixed top-0 right-0 h-full w-full sm:w-[300px] lg:w-[450px] bg-base-100 shadow-lg transition-transform duration-300 ease-in-out z-50"
      :class="open ? 'translate-x-0' : 'translate-x-full'"
    >
      <p class="text-lg font-bold p-4" v-if="title">{{ title }}</p>
      <div class="p-4 h-full overflow-y-auto">
        <slot></slot>
      </div>
    </aside>
  </Teleport>
</template>
<style>
body:has(.drawer-right-overlay) {
  overflow: hidden;
}
</style>

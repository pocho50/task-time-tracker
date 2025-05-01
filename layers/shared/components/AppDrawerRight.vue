<script setup lang="ts">
const open = defineModel<boolean>();

defineProps<{ title?: string }>();
const closeDrawer = () => {
  open.value = false;
};

// Add event listener for Escape key
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    closeDrawer();
  }
}
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
      <div class="flex flex-col h-full">
        <p class="text-lg font-bold p-4" v-if="title">{{ title }}</p>
        <div class="p-4 h-full overflow-y-auto grow">
          <slot></slot>
        </div>
        <footer class="p-4 flex justify-end gap-4">
          <slot name="actions"></slot>
        </footer>
      </div>
    </aside>
  </Teleport>
</template>
<style>
body:has(.drawer-right-overlay) {
  overflow: hidden;
}
</style>

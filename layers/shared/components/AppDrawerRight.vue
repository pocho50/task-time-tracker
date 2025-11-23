<script setup lang="ts">
const open = defineModel<boolean>();

const props = withDefaults(
  defineProps<{ title?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }>(),
  {
    size: 'sm',
  }
);
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

const getDimensions = computed(() => {
  if (props.size === 'sm') {
    return 'sm:w-[300px] lg:w-[450px]';
  } else if (props.size === 'md') {
    return 'sm:w-[450px] lg:w-[700px]';
  } else if (props.size === 'lg') {
    return 'sm:w-[450px] lg:w-[1000px]';
  } else {
    return 'w-full';
  }
});
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div
      v-if="open"
      :class="{ 'drawer-right-overlay': open }"
      class="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out z-40"
      @click="closeDrawer"
    />

    <!-- Drawer -->
    <aside
      class="fixed top-0 right-0 h-full w-full bg-base-100 shadow-lg transition-transform duration-300 ease-in-out z-50"
      :class="[
        {
          'translate-x-0': open,
          'translate-x-full': !open,
        },
        getDimensions,
      ]"
    >
      <div class="flex flex-col h-full">
        <p v-if="title" class="text-lg font-bold p-4">{{ title }}</p>
        <div class="p-4 h-full overflow-y-auto grow">
          <slot/>
        </div>
        <footer class="p-4 flex justify-end gap-4">
          <slot name="actions"/>
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

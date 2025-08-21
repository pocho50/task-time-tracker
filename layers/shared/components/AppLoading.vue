<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
  center?: boolean;
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  text: '',
  variant: 'spinner',
  center: false,
  overlay: false,
});

const sizeClasses = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
  xl: 'loading-xl',
};

const variantClasses = {
  spinner: 'loading-spinner',
  dots: 'loading-dots',
  ring: 'loading-ring',
  ball: 'loading-ball',
  bars: 'loading-bars',
  infinity: 'loading-infinity',
};

const loadingClasses = computed(() => [
  'loading',
  sizeClasses[props.size],
  variantClasses[props.variant],
]);
</script>

<template>
  <!-- Overlay Loading -->
  <div
    v-if="overlay"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <div class="bg-base-100 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
      <span :class="loadingClasses"></span>
      <p v-if="text" class="text-base-content font-medium">{{ text }}</p>
    </div>
  </div>

  <!-- Centered Loading -->
  <div
    v-else-if="center"
    class="flex flex-col items-center justify-center py-12 gap-4"
  >
    <span :class="loadingClasses"></span>
    <p v-if="text" class="text-base-content/70">{{ text }}</p>
  </div>

  <!-- Inline Loading -->
  <div v-else class="flex items-center gap-3">
    <span :class="loadingClasses"></span>
    <span v-if="text" class="text-base-content/70">{{ text }}</span>
  </div>
</template>

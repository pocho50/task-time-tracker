<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string;
    title: string;
    message?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    closable?: boolean;
  }>(),
  {
    type: 'info',
    duration: 5000,
    closable: true,
  }
);

const emit = defineEmits<{
  (e: 'close', id: string): void;
}>();

const typeIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'mdi:check-circle-outline';
    case 'error':
      return 'mdi:alert-circle-outline';
    case 'warning':
      return 'mdi:alert-outline';
    default:
      return 'mdi:information-outline';
  }
});

const typeClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-error';
    case 'warning':
      return 'alert-warning';
    default:
      return 'alert-info';
  }
});

if (props.duration && props.duration > 0) {
  setTimeout(() => emit('close', props.id), props.duration);
}

function handleClose() {
  emit('close', props.id);
}
</script>

<template>
  <div
    class="alert shadow-lg flex items-start gap-3 min-w-[280px] max-w-xs"
    :class="typeClass"
    role="alert"
    data-testid="toast"
  >
    <Icon :name="typeIcon" size="28" class="shrink-0 mt-1" />
    <div class="flex-1">
      <span class="font-bold block">{{ title }}</span>
      <span v-if="message" class="block text-sm opacity-80 mt-1">{{
        message
      }}</span>
    </div>
    <button
      v-if="closable"
      class="btn btn-ghost hover:bg-transparent focus:bg-transparent border-none btn-sm ml-2 mt-1"
      aria-label="Close"
      @click="handleClose"
      data-testid="toast-close"
    >
      <Icon name="mdi:close" size="20" />
    </button>
  </div>
</template>

<style scoped>
.alert {
  animation: toast-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

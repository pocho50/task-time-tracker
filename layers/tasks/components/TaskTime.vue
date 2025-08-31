<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    accumulatedSeconds?: number;
  }>(),
  {
    accumulatedSeconds: 0,
  }
);

const emit = defineEmits<{
  start: [];
  pause: [totalSeconds: number];
}>();

const accumulatedSeconds = toRef(props, 'accumulatedSeconds');

const {
  counter,
  pause: pauseCounter,
  resume: resumeCounter,
  isActive,
} = useInterval(1000, {
  controls: true,
  immediate: false,
});

const pad = (n: number) => String(n).padStart(2, '0');

const formattedTime = computed(() => {
  const totalSeconds = accumulatedSeconds.value + counter.value;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});

const handleStart = () => {
  resumeCounter();
  emit('start');
};

const handlePause = () => {
  const totalSeconds = accumulatedSeconds.value + counter.value;
  pauseCounter();
  emit('pause', totalSeconds);
};
</script>

<template>
  <div class="inline-flex items-center gap-2 rounded-btn bg-base-200 px-3 py-1">
    <div
      class="badge font-mono badge-lg"
      :class="{ 'badge-error': isActive, 'badge-neutral': !isActive }"
      :title="formattedTime"
    >
      {{ formattedTime }}
    </div>

    <AppButton
      v-if="!isActive"
      variant="ghost"
      size="sm"
      @click="handleStart"
      aria-label="Start timer"
      title="Start"
    >
      <Icon name="mdi:play" class="text-success" size="24" />
    </AppButton>
    <AppButton
      v-else
      variant="ghost"
      size="sm"
      @click="handlePause"
      aria-label="Pause timer"
      title="Pause"
    >
      <Icon name="mdi:pause" class="text-warning" size="24" />
    </AppButton>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    accumulatedSeconds?: number;
    initialSeconds?: number;
    startInmediate?: boolean;
    readOnly?: boolean;
  }>(),
  {
    accumulatedSeconds: 0,
    initialSeconds: 0,
    startInmediate: false,
    readOnly: false,
  }
);

const emit = defineEmits<{
  '@start': [];
  '@end': [totalSeconds: number];
}>();

const isActive = ref(false);
const startTimestamp = ref<number | null>(null);
const elapsedSeconds = ref(0);

const updateElapsed = () => {
  if (startTimestamp.value !== null) {
    elapsedSeconds.value = Math.floor(
      (Date.now() - startTimestamp.value) / 1000
    );
  }
};

const { pause: pauseTick, resume: resumeTick } = useIntervalFn(
  updateElapsed,
  1000,
  { immediate: false }
);

// Force update when the tab becomes visible again
if (import.meta.client) {
  useEventListener(document, 'visibilitychange', () => {
    if (!document.hidden && isActive.value) {
      updateElapsed();
    }
  });
}

const pad = (n: number) => String(n).padStart(2, '0');

const formattedTime = computed(() => {
  const activeSessionSeconds = props.initialSeconds + elapsedSeconds.value;
  const totalSeconds = props.accumulatedSeconds + activeSessionSeconds;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});

const startCounter = () => {
  startTimestamp.value = Date.now();
  elapsedSeconds.value = 0;
  isActive.value = true;
  resumeTick();
};

const handleStart = () => {
  startCounter();
  if (!props.readOnly) emit('@start');
};

const handlePause = () => {
  if (props.readOnly) return;
  const activeSessionSeconds = props.initialSeconds + elapsedSeconds.value;
  const totalSeconds = props.accumulatedSeconds + activeSessionSeconds;
  pauseTick();
  startTimestamp.value = null;
  elapsedSeconds.value = 0;
  isActive.value = false;
  emit('@end', totalSeconds);
};

if (props.startInmediate) {
  startCounter();
}

watch(
  () => props.startInmediate,
  (newValue) => {
    if (newValue) {
      startCounter();
    } else {
      pauseTick();
      startTimestamp.value = null;
      elapsedSeconds.value = 0;
      isActive.value = false;
    }
  }
);
</script>

<template>
  <div
    class="group inline-flex w-fit max-w-max whitespace-nowrap items-center gap-2 rounded-full border border-base-200 bg-base-100 py-1 pl-4 pr-1 shadow-sm transition-all duration-300 hover:border-base-300 hover:shadow-md"
    :class="{ 'border-error/30 bg-error/5 ring-1 ring-error/20': isActive }"
  >
    <!-- Status Indicator -->
    <div class="relative flex items-center justify-center px-1">
      <div v-if="isActive" class="absolute rounded-full bg-error opacity-75" />
      <div
        class="h-2.5 w-2.5 rounded-full shadow-sm transition-colors duration-300"
        :class="
          isActive
            ? 'bg-error'
            : 'bg-base-content/20 group-hover:bg-base-content/30'
        "
      />
    </div>

    <!-- Time Display -->
    <div
      data-testid="task-time-display"
      class="pr-3 font-mono text-lg font-bold tracking-wide tabular-nums text-base-content"
      :class="{ 'text-error': isActive }"
      :title="formattedTime"
    >
      {{ formattedTime }}
    </div>
    <template v-if="!readOnly">
      <!-- Vertical Separator -->
      <div class="h-5 w-px bg-base-200" />
      <div class="flex items-center">
        <AppButton
          v-if="!isActive"
          variant="ghost"
          size="sm"
          custom-class="btn-circle hover:bg-success/10 hover:text-success transition-colors"
          aria-label="Start timer"
          title="Start"
          data-testid="start-timer-button"
          @click="handleStart"
        >
          <Icon name="mdi:play" size="24" />
        </AppButton>

        <AppButton
          v-else
          variant="ghost"
          size="sm"
          custom-class="btn-circle hover:bg-warning/10 hover:text-warning transition-colors"
          aria-label="Pause timer"
          title="Pause"
          data-testid="pause-timer-button"
          @click="handlePause"
        >
          <Icon name="mdi:pause" size="24" />
        </AppButton>
      </div>
    </template>

    <!-- Actions -->
  </div>
</template>

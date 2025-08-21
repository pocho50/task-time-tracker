<script setup lang="ts">
interface Props {
  projectId?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Sprint',
  placeholder: 'Select Sprint',
  disabled: false,
  class: 'w-full max-w-xs',
});

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const model = defineModel<string>();

// Get sprints for the selected project
const { sprints, projectIdRef } = useSprints(props.projectId || '');

// Transform sprints to options format for AppAutocomplete
const sprintOptions = computed(() => {
  return (
    sprints.value?.map((sprint) => ({
      value: sprint.id,
      label: sprint.name,
    })) || []
  );
});

// Find selected sprint option
const selectedSprint = computed(() => {
  if (!model.value) return undefined;
  return sprintOptions.value.find((option) => option.value === model.value);
});

function handleChange(sprintId: string | number | null) {
  if (sprintId !== null) {
    model.value = sprintId.toString();
    emit('change', sprintId.toString());
  }
}

// Watch for projectId changes to clear selection
watch(
  () => props.projectId,
  async () => {
    projectIdRef.value = props.projectId || '';
  }
);
</script>

<template>
  <div class="form-control" :class="props.class">
    <AppAutocomplete
      v-if="props.projectId"
      :options="sprintOptions"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled || !props.projectId"
      :model-value="selectedSprint?.value"
      @update:model-value="handleChange"
      clearable
    />
    <div v-else class="form-control" :class="props.class">
      <label class="label">
        <span class="label-text">{{ label }}</span>
      </label>
      <input
        type="text"
        :placeholder="$t('sprintList.selectProjectFirst')"
        class="input input-bordered"
        disabled
      />
    </div>
  </div>
</template>

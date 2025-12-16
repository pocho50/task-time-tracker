<script setup lang="ts">
interface Props {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Project',
  placeholder: 'Select Project',
  disabled: false,
  class: 'w-full max-w-xs',
});

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const model = defineModel<string>();

// Get all projects for selector
const { projects } = useProjects(true);

// Transform projects to options format for AppAutocomplete
const projectOptions = computed(() => {
  return (
    projects.value?.map((project) => ({
      value: project.id,
      label: project.name,
    })) || []
  );
});

// Find selected project option
const selectedProject = computed(() => {
  if (!model.value) return undefined;
  return projectOptions.value.find((option) => option.value === model.value);
});

function handleChange(projectId: string | number | null) {
  if (projectId !== null) {
    model.value = projectId.toString();
    emit('change', projectId.toString());
  }
}
</script>

<template>
  <div class="form-control" :class="props.class">
    <AppAutocomplete
      v-if="selectedProject?.value"
      :options="projectOptions"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :model-value="selectedProject?.value"
      clearable
      @update:model-value="handleChange"
    />
  </div>
</template>

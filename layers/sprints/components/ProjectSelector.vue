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
const { projects } = useProjectsForSelector();

function handleChange() {
  emit('change', model.value!);
}
</script>

<template>
  <div class="form-control" :class="props.class">
    <label class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <select
      class="select select-bordered w-full"
      v-model="model"
      :disabled="disabled"
      @change="handleChange"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="project in projects" :key="project.id" :value="project.id">
        {{ project.name }}
      </option>
    </select>
  </div>
</template>

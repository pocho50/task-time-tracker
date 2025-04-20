<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";

const validationSchema = toTypedSchema(projectSchema);

const props = defineProps<{
  initialData?: ProjectFormData;
}>();

const emit = defineEmits<{
  (e: "@submit", data: ProjectFormData): void;
}>();

const formValues = reactive({
  name: props.initialData?.name || "",
  description: props.initialData?.description || "",
});

watch(
  () => props.initialData,
  (newData) => {
    formValues.name = newData?.name || "";
    formValues.description = newData?.description || "";
  },
  { deep: true }
);

const onSubmit = (values: Record<string, any>) => {
  // save values and close drawer
  const projectData: ProjectFormData = {
    id: props.initialData?.id,
    name: values.name,
    description: values.description,
  };
  emit("@submit", projectData);
};
</script>

<template>
  <VeeForm
    :validation-schema="validationSchema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <AppFormInput
      type="text"
      name="name"
      class-input="w-full"
      placeholder="Project Name"
      v-model="formValues.name"
    />
    <AppFormTextarea
      name="description"
      class-input="w-full"
      placeholder="Project Description"
      v-model="formValues.description"
    />

    <button type="submit" class="btn btn-primary">
      {{ initialData?.id ? "Update" : "Create" }} Project
    </button>
  </VeeForm>
</template>

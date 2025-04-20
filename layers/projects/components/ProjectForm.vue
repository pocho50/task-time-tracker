<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";

const validationSchema = toTypedSchema(projectSchema);

const props = defineProps<{
  initialData?: ProjectFormData;
}>();

const emit = defineEmits<{
  (e: "submit", data: ProjectFormData): void;
}>();

const formValues = {
  name: props.initialData?.name || "",
  description: props.initialData?.description || "",
};

watch(
  () => props.initialData?.id,
  () => {
    formValues.name = props.initialData?.name || "";
    formValues.description = props.initialData?.description || "";
  }
);

const onSubmit = (values: ProjectFormData) => {
  emit("submit", {
    ...values,
    id: props.initialData?.id,
  });
};
</script>

<template>
  <VeeForm :validation-schema="validationSchema" class="flex flex-col gap-4">
    <AppFormInput
      type="text"
      name="name"
      class-input="w-full"
      placeholder="Project Name"
      v-model="formValues.name"
    />
    <AppFormInput
      name="description"
      class-input="w-full"
      placeholder="Project Description"
      type="textarea"
      v-model="formValues.description"
    />

    <button type="submit" class="btn btn-primary">
      {{ initialData?.id ? "Update" : "Create" }} Project
    </button>
  </VeeForm>
</template>

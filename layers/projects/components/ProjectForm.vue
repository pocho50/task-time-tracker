<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';

const validationSchema = toTypedSchema(projectSchema);

const props = defineProps<{
  initialData?: ProjectFormData;
}>();

const form = useTemplateRef('form');

const selectedUsers = ref<string[]>([]);
selectedUsers.value = props.initialData?.usersId ?? [];

provide('selectedUsers', selectedUsers);

const emit = defineEmits<{
  (e: '@submit', data: ProjectFormData): void;
}>();

const onSubmit = (values: Record<string, any>) => {
  // save values
  const projectData: ProjectFormData = {
    id: props.initialData?.id,
    name: values.name,
    description: values.description,
    usersId: selectedUsers.value,
  };
  emit('@submit', projectData);
};

const triggerSubmit = () => {
  form.value?.requestSubmit();
};

defineExpose({
  triggerSubmit,
});
</script>

<template>
  <VeeForm
    :validation-schema="validationSchema"
    :initial-values="initialData"
    class="flex flex-col gap-4"
    v-slot="{ handleSubmit }"
    as="div"
  >
    <form @submit="handleSubmit($event, onSubmit)" ref="form">
      <AppFormInput
        type="text"
        name="name"
        class-input="w-full"
        :placeholder="$t('projectName')"
      />
      <AppFormTextarea
        name="description"
        class-input="w-full"
        :placeholder="$t('projectDescription')"
      />
      <ProjectFormMultiSelectUsers />
    </form>
  </VeeForm>
</template>

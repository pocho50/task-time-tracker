<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { SPRINT_STATUSES } from '#layers/sprints/utils/constants';
import { sprintSchema, type SprintFormData } from '../schemas';

const validationSchema = toTypedSchema(sprintSchema);

const props = defineProps<{
  initialData?: SprintFormData;
}>();

const form = useTemplateRef('form');

const emit = defineEmits<{
  (e: '@submit', data: SprintFormData): void;
}>();

const onSubmit = (values: Record<string, any>) => {
  const sprintData: SprintFormData = {
    id: props.initialData?.id,
    name: values.name,
    startDate: values.startDate,
    endDate: values.endDate,
    status: values.status || 'PLANNING',
  };
  emit('@submit', sprintData);
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
        :placeholder="$t('sprintForm.name')"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppFormInput
          type="date"
          name="startDate"
          class-input="w-full"
          :placeholder="$t('sprintForm.startDate')"
        />
        <AppFormInput
          type="date"
          name="endDate"
          class-input="w-full"
          :placeholder="$t('sprintForm.endDate')"
        />
      </div>
      <AppFormSelect
        name="status"
        class-input="w-full"
        :options="SPRINT_STATUSES.map((status) => ({ 
          value: status, 
          text: $t(`sprintForm.status${status.charAt(0) + status.slice(1).toLowerCase()}`) 
        }))"
        :placeholder="$t('sprintForm.status')"
      />
    </form>
  </VeeForm>
</template>

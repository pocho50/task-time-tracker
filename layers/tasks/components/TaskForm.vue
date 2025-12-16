<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { ROLES } from '#layers/shared/utils/constants';

const validationSchema = toTypedSchema(taskSchema);

const props = defineProps<{
  initialData?: TaskFormData;
}>();

const form = useTemplateRef('form');

const { user } = useUser();

// Check if current user is USER role (not ADMIN)
const isUserRole = computed(() => user.value?.role === ROLES.USER);

const selectedUsers = ref<string[]>([]);
selectedUsers.value = props.initialData?.usersId ?? [];

provide('selectedUsers', selectedUsers);

const selectedSprintId = ref<string | undefined>(props.initialData?.sprintId);

const emit = defineEmits<{
  (e: '@submit', data: TaskFormData): void;
}>();

const statusOptions = [
  { value: TaskStatus.ANALYZING, text: 'Analyzing' },
  { value: TaskStatus.APPROVED, text: 'Approved' },
  { value: TaskStatus.IN_PROGRESS, text: 'In Progress' },
  { value: TaskStatus.FINALIZED, text: 'Finalized' },
];

const priorityOptions = [
  { value: TaskPriority.LOW, text: 'Low' },
  { value: TaskPriority.MEDIUM, text: 'Medium' },
  { value: TaskPriority.HIGH, text: 'High' },
];

const onSubmit = (values: Record<string, any>) => {
  const taskData: TaskFormData = {
    id: props.initialData?.id,
    name: values.name,
    description: values.description,
    projectId: values.projectId,
    sprintId: selectedSprintId.value ?? values.sprintId,
    priority: values.priority,
    status: values.status,
    estimatedHours: values.estimatedHours
      ? Number(values.estimatedHours)
      : undefined,
    usersId: selectedUsers.value,
  };
  emit('@submit', taskData);
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
    v-slot="{ handleSubmit }"
    :validation-schema="validationSchema"
    :initial-values="initialData"
    class="flex flex-col gap-4"
    as="div"
  >
    <form ref="form" @submit="handleSubmit($event, onSubmit)">
      <AppFormInput
        type="text"
        name="name"
        class-input="w-full"
        :placeholder="$t('taskForm.name')"
        :label="$t('taskForm.name')"
      />

      <AppFormEditor
        name="description"
        class-input="w-full"
        :placeholder="$t('taskForm.description')"
        :label="$t('taskForm.description')"
      />

      <AppSprintSelector
        v-if="initialData?.projectId"
        v-model="selectedSprintId"
        :project-id="initialData.projectId"
        :label="$t('taskForm.sprint')"
        :placeholder="$t('taskForm.sprint')"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppFormSelect
          name="priority"
          :options="priorityOptions"
          :placeholder="$t('taskForm.priority')"
          :label="$t('taskForm.priority')"
        />

        <AppFormSelect
          name="status"
          :options="statusOptions"
          :placeholder="$t('taskForm.status')"
          :label="$t('taskForm.status')"
        />
      </div>

      <AppFormInput
        type="number"
        name="estimatedHours"
        class-input="w-full"
        :placeholder="$t('taskForm.estimatedHours')"
        :label="$t('taskForm.estimatedHours')"
        step="0.5"
        min="0"
      />

      <!-- User assignment - only show for ADMIN users -->
      <TaskFormMultiSelectUsers v-if="!isUserRole" />
    </form>
  </VeeForm>
</template>

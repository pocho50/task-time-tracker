<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { ROLES } from '#layers/users/utils/constants';

const emit = defineEmits<{
  (e: '@submit', data: UserDataForm): void;
}>();

const props = defineProps<{
  initialData?: UserDataForm;
  isCreate?: boolean;
}>();

const validationSchema = toTypedSchema(getUserSchema(props.isCreate));

const form = useTemplateRef('form');

const onSubmit = (values: Record<string, any>) => {
  // save values
  const userData: UserDataForm = {
    id: props.initialData?.id,
    name: values.name,
    email: values.email,
    role: values.role,
    password: values.password,
    repeatPassword: values.repeatPassword,
  };
  emit('@submit', userData);
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
    v-slot="{ handleSubmit }"
    class="flex flex-col gap-4"
    as="div"
  >
    <form
      @submit="handleSubmit($event, onSubmit)"
      ref="form"
      data-testid="user-form"
    >
      <AppFormInput
        name="name"
        type="text"
        class-input="w-full"
        :placeholder="$t('userForm.name')"
      />
      <AppFormInput
        name="email"
        type="email"
        class-input="w-full"
        :placeholder="$t('userForm.email')"
      />
      <AppFormSelect
        name="role"
        class-input="w-full"
        :options="ROLES.map((r) => ({ value: r, text: r }))"
        :placeholder="$t('userForm.role')"
      />
      <AppFormPassword
        class-input="w-full"
        name="password"
        :placeholder="$t('userForm.password')"
      />
      <AppFormPassword
        class-input="w-full"
        name="repeatPassword"
        :placeholder="$t('userForm.repeatPassword')"
      />
    </form>
  </VeeForm>
</template>

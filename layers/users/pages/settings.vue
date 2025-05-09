<script setup lang="ts">
import { LOCALES, THEMES } from '#layers/shared/utils/constants';
import { userSchema, type UserDataForm } from '#layers/users/schemas';
const { user, fetch: refreshSession } = useUserSession();
const validationSchema = toTypedSchema(userSchema);
const initialData: UserDataForm = {
  name: user.value?.name ?? '',
  locale: user.value?.locale ?? 'en',
  theme: user.value?.theme ?? 'light',
};

const { handleSave, loading } = useMe();
const onSubmit = (values: Record<string, any>) => {
  const userFormData: UserDataForm = {
    name: values.name,
    locale: values.locale,
    theme: values.theme,
  };
  handleSave(userFormData);
  refreshSession();
};
</script>
<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle :text="$t('settings.title')" />
    <VeeForm
      :validation-schema="validationSchema"
      :initial-values="initialData"
      class="flex flex-col gap-4 max-w-lg"
      v-slot="{ handleSubmit }"
      as="div"
    >
      <form @submit="handleSubmit($event, onSubmit)" ref="form">
        <AppFormInput
          type="text"
          name="name"
          class-input="w-full"
          :placeholder="$t('settings.userName')"
        />
        <AppFormSelect
          name="locale"
          class-input="w-full"
          :options="LOCALES.map((locale) => ({ value: locale, text: locale }))"
          :placeholder="$t('settings.userLocale')"
        />
        <AppFormSelect
          name="theme"
          class-input="w-full"
          :options="THEMES.map((theme) => ({ value: theme, text: theme }))"
          :placeholder="$t('settings.userTheme')"
        />
        <AppButton type="submit" :loading="loading">
          {{ $t('settings.save') }}
        </AppButton>
      </form>
    </VeeForm>
  </section>
</template>

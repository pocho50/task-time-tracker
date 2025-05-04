<script setup lang="ts">
import { loginSchema } from '#layers/users/schemas';
import { toTypedSchema } from '@vee-validate/zod';
const validationSchema = toTypedSchema(loginSchema);
const { loggedIn, user, fetch: refreshSession } = useUserSession();
definePageMeta({
  layout: 'center',
});

const credentials = ref({
  email: '',
  password: '',
});
const isLoading = ref(false);

const { $api } = useNuxtApp();

async function handleLogin() {
  try {
    isLoading.value = true;
    await $api('/login', {
      method: 'POST',
      body: credentials.value,
    });
    await refreshSession();
    await navigateTo('/');
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
const config = useRuntimeConfig();
</script>
<template>
  <div class="w-full max-w-md bg-base-100 rounded-lg shadow-xl p-8">
    <div class="flex justify-center mb-8">
      <TheLogo />
    </div>
    <h1 class="text-2xl font-bold text-center mb-6">
      {{ config.public.appTitle }}
    </h1>
    <VeeForm @submit="handleLogin" :validation-schema="validationSchema">
      <AppFormInput
        type="email"
        name="email"
        :placeholder="$t('login.email')"
        class-input="input input-bordered w-full"
        v-model="credentials.email"
        required
      />

      <AppFormPassword
        name="password"
        :placeholder="$t('login.password')"
        class-input="input input-bordered w-full"
        v-model="credentials.password"
      />

      <div class="form-control mt-6">
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading loading-spinner"></span>
          {{ isLoading ? $t('login.signingIn') : $t('login.submit') }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

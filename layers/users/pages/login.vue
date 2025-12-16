<script setup lang="ts">
import { loginSchema } from '#layers/users/schemas';
import { toTypedSchema } from '@vee-validate/zod';
const validationSchema = toTypedSchema(loginSchema);
definePageMeta({
  layout: 'center',
});

const { login, isLoading, credentials } = useLogin();
</script>
<template>
  <div class="w-full max-w-md bg-base-100 rounded-lg shadow-xl p-8">
    <div class="flex justify-center mb-8">
      <TheLogo />
    </div>
    <h1 class="text-2xl font-bold text-center mb-6">
      {{ useRuntimeConfig().public.appTitle }}
    </h1>
    <VeeForm :validation-schema="validationSchema" @submit="login">
      <AppFormInput
        v-model="credentials.email"
        type="email"
        name="email"
        data-testid="login-email"
        :placeholder="$t('login.email')"
        class-input="input input-bordered w-full"
        required
      />

      <AppFormPassword
        v-model="credentials.password"
        name="password"
        data-testid="login-password"
        :placeholder="$t('login.password')"
        class-input="input input-bordered w-full"
      />

      <div class="form-control mt-6">
        <button
          type="submit"
          data-testid="login-button"
          class="btn btn-primary w-full"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading loading-spinner"/>
          {{ isLoading ? $t('login.signingIn') : $t('login.submit') }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

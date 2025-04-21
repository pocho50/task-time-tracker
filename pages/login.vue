<script setup lang="ts">
import { loginSchema } from "~/schemas";
import { toTypedSchema } from "@vee-validate/zod";
const validationSchema = toTypedSchema(loginSchema);
const { loggedIn, user, fetch: refreshSession } = useUserSession();
definePageMeta({
  layout: "center",
});

const credentials = ref({
  email: "",
  password: "",
});
const isLoading = ref(false);

async function handleLogin() {
  try {
    isLoading.value = true;
    await $fetch("/api/login", {
      method: "POST",
      body: credentials.value,
    });
    await refreshSession();
    await navigateTo("/");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="w-full max-w-md bg-base-100 rounded-lg shadow-xl p-8">
    <div class="flex justify-center mb-8">
      <TheLogo class="w-32" />
    </div>
    <VeeForm @submit="handleLogin" :validation-schema="validationSchema">
      <AppFormInput
        type="email"
        name="email"
        placeholder="Email"
        class-input="input input-bordered w-full"
        v-model="credentials.email"
        required
      />

      <AppFormPassword
        name="password"
        placeholder="Password"
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
          {{ isLoading ? "Signing in..." : "Sign In" }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

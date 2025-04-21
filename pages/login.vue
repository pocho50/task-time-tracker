<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession();
definePageMeta({
  layout: "center",
});

const credentials = ref({
  email: "",
  password: "",
});
const isLoading = ref(false);
const showPassword = ref(false);

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
  <div>
    <div class="flex justify-center mb-8">
      <TheLogo class="w-32" />
    </div>
    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          type="email"
          v-model="credentials.email"
          placeholder="email@example.com"
          class="input input-bordered w-full"
          required
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Password</span>
        </label>

        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="credentials.password"
            placeholder="********"
            class="input input-bordered w-full"
            required
          />

          <Icon
            :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            size="16"
          />
        </div>
      </div>

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
    </form>
  </div>
</template>

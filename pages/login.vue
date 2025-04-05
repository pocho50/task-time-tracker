<script setup lang="ts">
definePageMeta({
  layout: "center",
});

const email = ref("");
const password = ref("");
const isLoading = ref(false);

async function handleLogin() {
  try {
    isLoading.value = true;
    // TODO: Implementar la lógica de autenticación aquí
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de delay
    console.log("Login attempt:", {
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    console.error("Error during login:", error);
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
          v-model="email"
          placeholder="correo@ejemplo.com"
          class="input input-bordered w-full"
          required
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Contraseña</span>
        </label>

        <input
          type="password"
          v-model="password"
          placeholder="********"
          class="input input-bordered w-full"
          required
        />
        <label class="label">
          <a href="#" class="label-text-alt link link-hover"
            >¿Olvidaste tu contraseña?</a
          >
        </label>
      </div>

      <div class="form-control mt-6">
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading loading-spinner"></span>
          {{ isLoading ? "Iniciando sesión..." : "Iniciar Sesión" }}
        </button>
      </div>
    </form>
  </div>
</template>

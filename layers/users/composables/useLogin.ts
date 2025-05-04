export function useLogin() {
  const isLoading = ref(false);
  const { fetch: refreshSession } = useUserSession();
  const { $api } = useNuxtApp();

  const credentials = ref({
    email: '',
    password: '',
  });

  async function login() {
    try {
      isLoading.value = true;
      await $api('/login', {
        method: 'POST',
        body: credentials.value,
      });
      await refreshSession();
      await navigateTo('/');
    } catch (error) {
      console.error('Login error');
    } finally {
      isLoading.value = false;
    }
  }

  return {
    login,
    isLoading,
    credentials,
  };
}

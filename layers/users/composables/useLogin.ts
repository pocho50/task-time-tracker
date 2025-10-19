import { safeApiCall } from '#layers/shared/utils';

export function useLogin() {
  const isLoading = ref(false);
  const { fetch: refreshSession } = useUserSession();
  const { $api } = useNuxtApp();

  const credentials = ref({
    email: '',
    password: '',
  });

  async function login() {
    isLoading.value = true;
    
    const result = await safeApiCall<void>(() =>
      $api('/login', {
        method: 'POST',
        body: credentials.value,
      })
    );
    
    if (result !== false) {
      await refreshSession();
      await navigateTo('/');
    }
    
    isLoading.value = false;
  }

  return {
    login,
    isLoading,
    credentials,
  };
}

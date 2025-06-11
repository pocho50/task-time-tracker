export default defineNuxtPlugin({
  setup() {
    const { $i18n } = useNuxtApp();
    const headers = useRequestHeaders(['cookie']);
    const { showToast } = useToast();

    const api = $fetch.create({
      baseURL: '/api',
      headers,
      async onResponse({ request, response, options }) {
        if (response.status === 200) {
          if (response?._data?.message && import.meta.client) {
            showToast({
              message: response._data.message,
              type: 'success',
            });
          }
        }
      },
      onResponseError: ({ response }) => {
        if (response?._data?.message && import.meta.client) {
          showToast({
            title: $i18n.t('common.error'),
            message: response._data.message,
            type: 'error',
          });
        }
      },
    });

    return {
      provide: {
        api,
      },
    };
  },
});

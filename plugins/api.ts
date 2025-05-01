export default defineNuxtPlugin({
  setup() {
    const headers = useRequestHeaders(['cookie']);
    const api = $fetch.create({
      baseURL: '/api',
      headers,
      onResponseError: ({ request, options, error }) => {
        console.log(error);
      },
    });

    return {
      provide: {
        api,
      },
    };
  },
});

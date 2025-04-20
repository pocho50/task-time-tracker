export default defineNuxtPlugin({
  setup() {
    const headers = useRequestHeaders(["cookie"]);
    const api = $fetch.create({
      headers,
    });

    return {
      provide: {
        api,
      },
    };
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["../shared"],
  imports: {
    dirs: ["./repository", "./schemas"],
  },
  i18n: {
    lazy: true,
    langDir: "locales",
    locales: [
      {
        code: "en",
        file: "en.js"
      }
    ]
  }
});

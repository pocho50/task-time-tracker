import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    head: {
      title: "Time Tracker",
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/test-utils",
    "@nuxt/image",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/app.css"],
});

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();

  if (to.path === "/login" && loggedIn.value) {
    return navigateTo("/");
  }

  if (to.path !== "/login" && !loggedIn.value) {
    return navigateTo("/login");
  }
});

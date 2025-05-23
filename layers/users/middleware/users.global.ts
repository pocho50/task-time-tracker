export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/users') {
    const { userIsAllowedToWrite } = useUser();
    if (!userIsAllowedToWrite(ENTITY)) {
      return navigateTo('/settings');
    }
  }
});

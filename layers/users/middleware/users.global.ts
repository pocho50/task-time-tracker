export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/users') {
    const { userIsAllowedToWrite } = useUser();
    if (!userIsAllowedToWrite(ALL_ENTITIES.USERS)) {
      return navigateTo('/settings');
    }
  }
});

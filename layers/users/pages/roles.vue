<script setup lang="ts">
const { roles, status } = useRoles();
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle :text="$t('roleList.title')" />

    <RoleList :roles="roles" />

    <AppEmptyState v-if="roles.length === 0 && status === 'success'">
      <template #title>{{ $t('roleList.noRolesFound') }}</template>
      {{ $t('roleList.noRolesFoundDescription') }}
    </AppEmptyState>
  </section>
</template>

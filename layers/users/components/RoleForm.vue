<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { roleSchema } from '#layers/users/schemas';
import type { RoleSavePayload } from '../repository/roleRepo';

const emit = defineEmits<{
  (e: '@submit', data: RoleSavePayload): void;
}>();

const props = defineProps<{
  initialData?: RoleSavePayload;
  isCreate?: boolean;
}>();

const validationSchema = toTypedSchema(roleSchema);

const form = useTemplateRef('form');

const permissionsState = reactive({
  projects: { write: false, del: false },
  sprints: { write: false, del: false },
  tasks: { write: false, del: false },
  users: { read: false, write: false, del: false },
  roles: { read: false, write: false, del: false },
  working: { read: false },
  reports: { read: false },
});

const toBitmask = (flags: {
  read?: boolean;
  write?: boolean;
  del?: boolean;
}) => {
  return (flags.read ? 1 : 0) | (flags.write ? 2 : 0) | (flags.del ? 4 : 0);
};

watch(
  () => props.initialData,
  (data) => {
    permissionsState.projects.write = false;
    permissionsState.projects.del = false;
    permissionsState.sprints.write = false;
    permissionsState.sprints.del = false;
    permissionsState.tasks.write = false;
    permissionsState.tasks.del = false;
    permissionsState.users.read = false;
    permissionsState.users.write = false;
    permissionsState.users.del = false;
    permissionsState.roles.read = false;
    permissionsState.roles.write = false;
    permissionsState.roles.del = false;
    permissionsState.working.read = false;
    permissionsState.reports.read = false;

    if (data?.permissions) {
      permissionsState.projects.write = (data.permissions.projects & 2) === 2;
      permissionsState.projects.del = (data.permissions.projects & 4) === 4;

      permissionsState.sprints.write = (data.permissions.sprints & 2) === 2;
      permissionsState.sprints.del = (data.permissions.sprints & 4) === 4;

      permissionsState.tasks.write = (data.permissions.tasks & 2) === 2;
      permissionsState.tasks.del = (data.permissions.tasks & 4) === 4;

      permissionsState.users.read = (data.permissions.users & 1) === 1;
      permissionsState.users.write = (data.permissions.users & 2) === 2;
      permissionsState.users.del = (data.permissions.users & 4) === 4;

      permissionsState.roles.read = (data.permissions.roles & 1) === 1;
      permissionsState.roles.write = (data.permissions.roles & 2) === 2;
      permissionsState.roles.del = (data.permissions.roles & 4) === 4;

      permissionsState.working.read = (data.permissions.working & 1) === 1;

      permissionsState.reports.read = (data.permissions.reports & 1) === 1;
    }
  },
  { immediate: true }
);

const onSubmit = (values: Record<string, any>) => {
  const payload: RoleSavePayload = {
    key: String(values.key ?? '').trim(),
    name: String(values.name ?? '').trim(),
    permissions: {
      projects: toBitmask({
        write: permissionsState.projects.write,
        del: permissionsState.projects.del,
      }),
      sprints: toBitmask({
        write: permissionsState.sprints.write,
        del: permissionsState.sprints.del,
      }),
      tasks: toBitmask({
        write: permissionsState.tasks.write,
        del: permissionsState.tasks.del,
      }),
      users: toBitmask(permissionsState.users),
      roles: toBitmask(permissionsState.roles),
      working: toBitmask({ read: permissionsState.working.read }),
      reports: toBitmask({ read: permissionsState.reports.read }),
    },
  };

  emit('@submit', payload);
};

const triggerSubmit = () => {
  form.value?.requestSubmit();
};

defineExpose({
  triggerSubmit,
});
</script>

<template>
  <VeeForm
    v-slot="{ handleSubmit }"
    :validation-schema="validationSchema"
    :initial-values="initialData"
    class="flex flex-col gap-4"
    as="div"
  >
    <form
      ref="form"
      data-testid="role-form"
      @submit="handleSubmit($event, onSubmit)"
    >
      <AppFormInput
        name="key"
        type="text"
        class-input="w-full"
        :placeholder="$t('roleForm.role')"
        :disabled="!isCreate"
      />
      <AppFormInput
        name="name"
        type="text"
        class-input="w-full"
        :placeholder="$t('roleForm.name')"
      />

      <div class="divider">{{ $t('roleForm.permissions') }}</div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-base-100 rounded-box p-4 border border-base-300">
          <div class="font-semibold mb-2">{{ $t('roleForm.projects') }}</div>
          <div class="flex flex-wrap gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.projects.write"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.write') }}</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.projects.del"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.delete') }}</span>
            </label>
          </div>
        </div>

        <div class="bg-base-100 rounded-box p-4 border border-base-300">
          <div class="font-semibold mb-2">{{ $t('roleForm.sprints') }}</div>
          <div class="flex flex-wrap gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.sprints.write"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.write') }}</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.sprints.del"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.delete') }}</span>
            </label>
          </div>
        </div>

        <div class="bg-base-100 rounded-box p-4 border border-base-300">
          <div class="font-semibold mb-2">{{ $t('roleForm.tasks') }}</div>
          <div class="flex flex-wrap gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.tasks.write"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.write') }}</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.tasks.del"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.delete') }}</span>
            </label>
          </div>
        </div>

        <div class="bg-base-100 rounded-box p-4 border border-base-300">
          <div class="font-semibold mb-2">{{ $t('roleForm.users') }}</div>
          <div class="flex flex-wrap gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.users.read"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.read') }}</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.users.write"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.write') }}</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.users.del"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.delete') }}</span>
            </label>
          </div>
        </div>

        <div class="bg-base-100 rounded-box p-4 border border-base-300">
          <div class="font-semibold mb-2">{{ $t('roleForm.roles') }}</div>
          <div class="flex flex-wrap gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.roles.read"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.read') }}</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.roles.write"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.write') }}</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.roles.del"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.delete') }}</span>
            </label>
          </div>
        </div>

        <div class="bg-base-100 rounded-box p-4 border border-base-300">
          <div class="font-semibold mb-2">{{ $t('roleForm.working') }}</div>
          <div class="flex flex-wrap gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.working.read"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.read') }}</span>
            </label>
          </div>
        </div>

        <div class="bg-base-100 rounded-box p-4 border border-base-300">
          <div class="font-semibold mb-2">{{ $t('roleForm.reports') }}</div>
          <div class="flex flex-wrap gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                v-model="permissionsState.reports.read"
                type="checkbox"
                class="checkbox"
              />
              <span class="label-text">{{ $t('roleForm.read') }}</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  </VeeForm>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: "This is required" })
      .email({ message: "Must be a valid email" }),
    password: zod
      .string()
      .min(1, { message: "This is required" })
      .min(8, { message: "Too short" }),
  })
);
function onSubmit(values: any) {
  alert(JSON.stringify(values, null, 2));
}
// TODO: Implement profile
const openDrawer = ref(false);
</script>
<template>
  <section class="py-12 px-4 bg-base-200">
    <AppTitle text="Profile" />
    <p>TODO: Implement profile</p>
    <button class="btn btn-primary" @click="openDrawer = !openDrawer">
      Open drawer
    </button>
    <AppDrawerRight v-model="openDrawer">
      <VeeForm
        :validation-schema="validationSchema"
        @submit="onSubmit"
        class="flex flex-col gap-2"
      >
        <AppFormInput
          name="email"
          class-input="w-full"
          type="email"
          placeholder="Email"
        />
        <AppFormInput
          name="password"
          class-input="w-full"
          type="password"
          placeholder="Password"
        />

        <button type="submit" class="btn btn-primary">Submit</button>
      </VeeForm>
    </AppDrawerRight>
  </section>
</template>

<script setup lang="ts"></script>
<template>
  <aside class="drawer-side shadow-md z-20">
    <label
      for="main-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
    ></label>
    <div
      class="bg-base-100 text-base-content min-h-full w-[var(--aside-width)] flex flex-col"
    >
      <TheLogo />

      <!-- Menu items -->
      <ul class="menu p-4 w-full">
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </aside>
</template>

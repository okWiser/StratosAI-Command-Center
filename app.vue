<template>
  <div :data-theme="isDark ? 'dark' : 'light'" class="app-wrapper">
    <NuxtPage />
  </div>
</template>

<script setup>
const { isDark } = useTheme()
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  background: var(--theme-background);
  color: var(--theme-text);
  transition: all 0.3s ease;
}
</style>
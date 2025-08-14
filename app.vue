<template>
  <div :data-theme="isDark ? 'dark' : 'light'" class="app-wrapper">
    <NuxtPage />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
}

// Provide theme state to child components
provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
</script>

<style>
:root {
  /* Dark Theme */
  --theme-background: linear-gradient(135deg, #0a0a0b 0%, #1a1a1b 100%);
  --theme-text: #ffffff;
  --theme-textSecondary: #a0a0a0;
  --theme-surface: #1a1a1b;
  --theme-border: rgba(212, 175, 55, 0.2);
  --theme-glass: rgba(255, 255, 255, 0.1);
  --luxe-gold: #D4AF37;
  --luxe-emerald: #0F4C3A;
  --luxe-sapphire: #1E3A8A;
  --luxe-obsidian: #0A0A0B;
  --luxe-crimson: #DC2626;
  --luxe-amber: #F59E0B;
  --royal-gradient: linear-gradient(135deg, #D4AF37, #1E3A8A);
  --emerald-gradient: linear-gradient(135deg, #0F4C3A, #10B981);
  --sapphire-gradient: linear-gradient(135deg, #1E3A8A, #3B82F6);
  --gold-glow: 0 0 20px rgba(212, 175, 55, 0.3);
  --emerald-glow: 0 0 20px rgba(15, 76, 58, 0.3);
  --sapphire-glow: 0 0 20px rgba(30, 58, 138, 0.3);
  --luxe-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

[data-theme="light"] {
  /* Light Theme */
  --theme-background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  --theme-text: #212529;
  --theme-textSecondary: #6c757d;
  --theme-surface: #ffffff;
  --theme-border: rgba(212, 175, 55, 0.3);
  --theme-glass: rgba(255, 255, 255, 0.8);
  --luxe-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.app-wrapper {
  min-height: 100vh;
  background: var(--theme-background);
  color: var(--theme-text);
  transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
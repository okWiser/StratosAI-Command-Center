<template>
  <div :data-theme="isDark ? 'dark' : 'light'" class="app-wrapper">
    <NuxtPage />
  </div>
</template>

<script setup>
const isDark = ref(true)
</script>

<style>
:root {
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

.app-wrapper {
  min-height: 100vh;
  background: var(--theme-background);
  color: var(--theme-text);
  transition: all 0.3s ease;
}
</style>
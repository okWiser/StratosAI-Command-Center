<template>
  <div class="skeleton-loader" :class="variant">
    <div class="skeleton-shimmer"></div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'card',
    validator: (value) => ['card', 'chart', 'text', 'avatar', 'button'].includes(value)
  }
})
</script>

<style scoped>
.skeleton-loader {
  background: var(--theme-glass);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 1.5s infinite;
}

.skeleton-loader.card {
  height: 120px;
  border-radius: 16px;
}

.skeleton-loader.chart {
  height: 300px;
  border-radius: 20px;
}

.skeleton-loader.text {
  height: 16px;
  border-radius: 4px;
}

.skeleton-loader.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-loader.button {
  height: 40px;
  border-radius: 12px;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>
<template>
  <div class="skeleton-loader" :class="variant">
    <div class="skeleton-content"></div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'card'
  }
})
</script>

<style scoped>
.skeleton-loader {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.skeleton-loader.card {
  height: 200px;
  padding: 24px;
}

.skeleton-loader.chart {
  height: 300px;
  padding: 16px;
}

.skeleton-content {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
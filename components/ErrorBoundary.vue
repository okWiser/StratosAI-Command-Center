<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{{ errorMessage }}</p>
      <div class="error-actions">
        <button @click="retry" class="retry-btn">🔄 Retry</button>
        <button @click="reportError" class="report-btn">📧 Report Issue</button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
const hasError = ref(false)
const errorMessage = ref('')

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  window.location.reload()
}

const reportError = () => {
  const subject = encodeURIComponent('StratosAI Dashboard Error Report')
  const body = encodeURIComponent(`Error: ${errorMessage.value}\nTime: ${new Date().toISOString()}`)
  window.open(`mailto:wisanichauke@stratos.com?subject=${subject}&body=${body}`)
}

onErrorCaptured((error) => {
  hasError.value = true
  errorMessage.value = error.message || 'An unexpected error occurred'
  return false
})
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
}

.error-content {
  text-align: center;
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--luxe-crimson);
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-content h3 {
  color: var(--luxe-crimson);
  margin-bottom: 8px;
}

.error-content p {
  color: var(--theme-textSecondary);
  margin-bottom: 24px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.retry-btn, .report-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn {
  background: var(--royal-gradient);
  color: white;
  border: none;
}

.report-btn {
  background: transparent;
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
}

.retry-btn:hover, .report-btn:hover {
  transform: translateY(-2px);
}
</style>
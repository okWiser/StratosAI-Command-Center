<template>
  <v-card class="ai-insight mb-4" elevation="8">
    <v-card-text class="pa-6">
      <div class="d-flex justify-space-between align-center mb-3">
        <div class="d-flex align-center">
          <v-icon class="mr-3" size="28">mdi-brain</v-icon>
          <h3 class="text-h6 font-weight-bold">{{ insight.title }}</h3>
        </div>
        <v-chip 
          :color="priorityColor" 
          variant="elevated"
          size="small"
          class="font-weight-bold text-uppercase"
        >
          {{ insight.priority }}
        </v-chip>
      </div>
      
      <p class="text-body-1 mb-4 opacity-90">{{ insight.description }}</p>
      
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <span class="text-caption mr-2">AI Confidence:</span>
          <v-progress-linear
            :model-value="insight.confidence"
            color="white"
            bg-color="rgba(255,255,255,0.3)"
            height="6"
            rounded
            class="flex-grow-0"
            style="width: 100px;"
          />
          <span class="text-caption ml-2 font-weight-bold">{{ insight.confidence }}%</span>
        </div>
        
        <v-btn
          variant="outlined"
          color="white"
          size="small"
          class="font-weight-medium"
        >
          View Details
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface AIInsight {
  id: string
  title: string
  description: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
  category: 'revenue' | 'operations' | 'market' | 'risk'
}

const props = defineProps<{
  insight: AIInsight
}>()

const priorityColor = computed(() => {
  switch (props.insight.priority) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    default: return 'info'
  }
})
</script>
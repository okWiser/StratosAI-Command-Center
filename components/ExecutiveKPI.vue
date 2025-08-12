<template>
  <v-card class="metric-card executive-card" elevation="0">
    <v-card-text class="pa-6">
      <div class="d-flex justify-space-between align-center mb-3">
        <h3 class="text-h6 font-weight-medium text-on-surface">{{ kpi.title }}</h3>
        <v-icon :color="trendColor" size="24">{{ trendIcon }}</v-icon>
      </div>
      
      <div class="mb-2">
        <span class="text-h4 font-weight-bold" :style="{ fontFamily: 'Playfair Display' }">
          {{ formattedValue }}
        </span>
      </div>
      
      <div class="d-flex align-center">
        <v-chip 
          :color="trendColor" 
          variant="tonal" 
          size="small"
          class="font-weight-medium"
        >
          {{ changePrefix }}{{ Math.abs(kpi.change) }}%
        </v-chip>
        <span class="text-caption text-medium-emphasis ml-2">vs last period</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface KPI {
  id: string
  title: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  format: 'currency' | 'percentage' | 'number'
}

const props = defineProps<{
  kpi: KPI
}>()

const { formatValue } = useDashboardStore()

const formattedValue = computed(() => formatValue(props.kpi.value, props.kpi.format))

const trendColor = computed(() => {
  switch (props.kpi.trend) {
    case 'up': return 'success'
    case 'down': return 'error'
    default: return 'info'
  }
})

const trendIcon = computed(() => {
  switch (props.kpi.trend) {
    case 'up': return 'mdi-trending-up'
    case 'down': return 'mdi-trending-down'
    default: return 'mdi-trending-neutral'
  }
})

const changePrefix = computed(() => props.kpi.change >= 0 ? '+' : '')
</script>
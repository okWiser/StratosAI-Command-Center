<template>
  <v-dialog v-model="dialog" max-width="900px">
    <v-card class="executive-card">
      <v-card-title class="text-h5 font-weight-bold">
        {{ title }} - Detailed Analysis
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <Line :data="detailChartData" :options="chartOptions" :height="200" />
          </v-col>
          <v-col cols="12" md="6">
            <v-list>
              <v-list-item v-for="metric in detailMetrics" :key="metric.label">
                <template #prepend>
                  <v-icon :color="metric.color">{{ metric.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ metric.label }}</v-list-item-title>
                <v-list-item-subtitle>{{ metric.value }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'

const props = defineProps<{
  modelValue: boolean
  title: string
  data: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const detailChartData = computed(() => ({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [{
    label: props.title,
    data: [85, 92, 88, 95],
    borderColor: '#1A237E',
    backgroundColor: 'rgba(26, 35, 126, 0.1)',
    tension: 0.4
  }]
}))

const detailMetrics = [
  { label: 'Peak Performance', value: '95.2%', icon: 'mdi-trending-up', color: 'success' },
  { label: 'Average', value: '90.1%', icon: 'mdi-chart-line', color: 'primary' },
  { label: 'Variance', value: '±3.2%', icon: 'mdi-sigma', color: 'info' }
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
}
</script>
<template>
  <v-card class="chart-container" elevation="4">
    <v-card-title class="text-h6 font-weight-bold pb-4">
      Revenue Analytics
      <v-spacer />
      <v-chip color="success" variant="tonal" size="small">
        <v-icon start size="16">mdi-trending-up</v-icon>
        +12.5% Growth
      </v-chip>
    </v-card-title>
    
    <v-card-text>
      <Line
        :data="chartData"
        :options="chartOptions"
        :height="300"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [2100000, 2300000, 2150000, 2650000, 2800000, 2847500],
      borderColor: '#1A237E',
      backgroundColor: 'rgba(26, 35, 126, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#1A237E',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6
    },
    {
      label: 'Forecast',
      data: [null, null, null, null, null, 2847500, 3200000],
      borderColor: '#FF6B35',
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      borderWidth: 2,
      borderDash: [5, 5],
      fill: false,
      tension: 0.4,
      pointBackgroundColor: '#FF6B35'
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        font: {
          family: 'Inter',
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#1A237E',
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          const value = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
          }).format(context.parsed.y)
          return `${context.dataset.label}: ${value}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        callback: (value: any) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact'
          }).format(value)
        },
        font: {
          family: 'Inter',
          size: 11
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 11,
          weight: '500'
        }
      }
    }
  }
}
</script>
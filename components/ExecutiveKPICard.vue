<template>
  <div class="executive-kpi-card" @click="showDetails = !showDetails">
    <div class="kpi-header">
      <div class="kpi-icon-container">
        <div class="kpi-icon" :class="kpi.category">
          <v-icon size="24" color="white">{{ getKPIIcon(kpi.category) }}</v-icon>
        </div>
        <div class="status-indicator" :class="getTrendClass(kpi.trend)"></div>
      </div>
      
      <div class="kpi-meta">
        <div class="kpi-title">{{ kpi.title }}</div>
        <div class="kpi-subtitle">{{ kpi.subtitle || 'Executive Metric' }}</div>
      </div>
    </div>

    <div class="kpi-value-section">
      <div class="primary-value">
        <span class="value-number">{{ formattedValue }}</span>
        <span class="value-unit">{{ kpi.unit || '' }}</span>
      </div>
      
      <div class="trend-indicator">
        <div class="trend-badge" :class="getTrendClass(kpi.trend)">
          <v-icon size="16">{{ getTrendIcon(kpi.trend) }}</v-icon>
          <span>{{ Math.abs(kpi.change) }}%</span>
        </div>
        <div class="trend-period">vs {{ kpi.period || 'last quarter' }}</div>
      </div>
    </div>

    <div class="kpi-sparkline">
      <svg width="100%" height="40" viewBox="0 0 200 40">
        <defs>
          <linearGradient :id="`gradient-${kpi.id}`" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="getSparklineColor(kpi.trend)" stop-opacity="0.3"/>
            <stop offset="100%" :stop-color="getSparklineColor(kpi.trend)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        
        <path 
          :d="sparklinePath" 
          :stroke="getSparklineColor(kpi.trend)"
          stroke-width="2" 
          fill="none"
          class="sparkline-path"
        />
        
        <path 
          :d="sparklinePath + ' L 200 40 L 0 40 Z'" 
          :fill="`url(#gradient-${kpi.id})`"
          class="sparkline-fill"
        />
        
        <!-- Data points -->
        <circle 
          v-for="(point, index) in sparklinePoints" 
          :key="index"
          :cx="point.x" 
          :cy="point.y" 
          r="2"
          :fill="getSparklineColor(kpi.trend)"
          class="sparkline-point"
        />
      </svg>
    </div>

    <div class="kpi-insights" v-if="kpi.insights">
      <div class="insight-item" v-for="insight in kpi.insights" :key="insight.label">
        <div class="insight-label">{{ insight.label }}</div>
        <div class="insight-value" :class="insight.trend">{{ insight.value }}</div>
      </div>
    </div>

    <!-- Executive Details Panel -->
    <v-expand-transition>
      <div v-if="showDetails" class="kpi-details">
        <v-divider class="my-3" />
        
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Target</div>
            <div class="detail-value">{{ kpi.target || 'N/A' }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Forecast</div>
            <div class="detail-value">{{ kpi.forecast || 'N/A' }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Confidence</div>
            <div class="detail-value">{{ kpi.confidence || '95%' }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Risk Level</div>
            <div class="detail-value" :class="getRiskClass(kpi.risk)">{{ kpi.risk || 'Low' }}</div>
          </div>
        </div>

        <div class="executive-actions mt-3">
          <v-btn size="small" variant="outlined" color="primary" class="mr-2" @click="openDeepDive">
            <v-icon start size="16">mdi-chart-line</v-icon>
            Deep Dive
          </v-btn>
          <v-btn size="small" variant="outlined" color="secondary" @click="exportData">
            <v-icon start size="16">mdi-download</v-icon>
            Export
          </v-btn>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  kpi: {
    id: string
    title: string
    subtitle?: string
    value: number
    change: number
    trend: 'up' | 'down' | 'stable'
    format: 'currency' | 'percentage' | 'number'
    category: 'revenue' | 'growth' | 'efficiency' | 'risk'
    unit?: string
    period?: string
    target?: string
    forecast?: string
    confidence?: string
    risk?: 'Low' | 'Medium' | 'High'
    sparkline?: number[]
    insights?: Array<{label: string, value: string, trend: string}>
  }
}>()

const showDetails = ref(false)

const { formatValue } = useDashboardStore()

const formattedValue = computed(() => formatValue(props.kpi.value, props.kpi.format))

const sparklineData = computed(() => 
  props.kpi.sparkline || [65, 72, 68, 75, 82, 78, 85, 90, 87, 92]
)

const sparklinePoints = computed(() => {
  const width = 200
  const height = 40
  const padding = 5
  
  const min = Math.min(...sparklineData.value)
  const max = Math.max(...sparklineData.value)
  const range = max - min || 1
  
  return sparklineData.value.map((value, index) => ({
    x: padding + (index * (width - 2 * padding)) / (sparklineData.value.length - 1),
    y: height - padding - ((value - min) / range) * (height - 2 * padding)
  }))
})

const sparklinePath = computed(() => {
  return sparklinePoints.value.map((point, index) => 
    index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
  ).join(' ')
})

const getKPIIcon = (category: string) => {
  const icons = {
    revenue: 'mdi-currency-usd',
    growth: 'mdi-trending-up',
    efficiency: 'mdi-speedometer',
    risk: 'mdi-shield-alert'
  }
  return icons[category] || 'mdi-chart-box'
}

const getTrendClass = (trend: string) => {
  return {
    up: 'trend-positive',
    down: 'trend-negative',
    stable: 'trend-neutral'
  }[trend] || 'trend-neutral'
}

const getTrendIcon = (trend: string) => {
  return {
    up: 'mdi-trending-up',
    down: 'mdi-trending-down',
    stable: 'mdi-trending-neutral'
  }[trend] || 'mdi-trending-neutral'
}

const getSparklineColor = (trend: string) => {
  return {
    up: '#10B981',
    down: '#EF4444',
    stable: '#6B7280'
  }[trend] || '#6B7280'
}

const getRiskClass = (risk: string) => {
  return {
    Low: 'risk-low',
    Medium: 'risk-medium',
    High: 'risk-high'
  }[risk] || 'risk-low'
}

const { mockActions } = useMockActions()

const openDeepDive = () => {
  mockActions.openKPIDrillDown(props.kpi)
}

const exportData = () => {
  mockActions.exportKPIData(props.kpi)
}
</script>

<style scoped>
.executive-kpi-card {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gold-gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--executive-shadow), var(--premium-glow);
    border-color: rgba(212, 175, 55, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.kpi-icon-container {
  position: relative;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &.revenue {
    background: linear-gradient(135deg, #10B981, #059669);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  }
  
  &.growth {
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  }
  
  &.efficiency {
    background: linear-gradient(135deg, #F59E0B, #D97706);
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
  }
  
  &.risk {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  }
}

.status-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--theme-surface);
  
  &.trend-positive {
    background: #10B981;
    box-shadow: 0 0 8px #10B981;
  }
  
  &.trend-negative {
    background: #EF4444;
    box-shadow: 0 0 8px #EF4444;
  }
  
  &.trend-neutral {
    background: #6B7280;
    box-shadow: 0 0 8px #6B7280;
  }
}

.kpi-meta {
  flex: 1;
}

.kpi-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 2px;
}

.kpi-subtitle {
  font-size: 12px;
  color: var(--theme-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.primary-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.value-number {
  font-size: 32px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  color: var(--theme-text);
  line-height: 1;
}

.value-unit {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-textSecondary);
}

.trend-indicator {
  text-align: right;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  
  &.trend-positive {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
  }
  
  &.trend-negative {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }
  
  &.trend-neutral {
    background: rgba(107, 114, 128, 0.1);
    color: #6B7280;
  }
}

.trend-period {
  font-size: 10px;
  color: var(--theme-textSecondary);
  margin-top: 2px;
}

.kpi-sparkline {
  margin-bottom: 16px;
  height: 40px;
}

.sparkline-path {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.sparkline-point {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.executive-kpi-card:hover .sparkline-point {
  opacity: 1;
}

.kpi-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.insight-item {
  text-align: center;
  padding: 8px;
  background: rgba(var(--theme-primary), 0.05);
  border-radius: 8px;
}

.insight-label {
  font-size: 10px;
  color: var(--theme-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.insight-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-text);
}

.kpi-details {
  border-top: 1px solid rgba(var(--theme-primary), 0.1);
  padding-top: 16px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: 10px;
  color: var(--theme-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
  
  &.risk-low { color: #10B981; }
  &.risk-medium { color: #F59E0B; }
  &.risk-high { color: #EF4444; }
}

.executive-actions {
  display: flex;
  gap: 8px;
}
</style>
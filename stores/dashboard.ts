import { defineStore } from 'pinia'

interface KPI {
  id: string
  title: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  format: 'currency' | 'percentage' | 'number'
}

interface AIInsight {
  id: string
  title: string
  description: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
  category: 'revenue' | 'operations' | 'market' | 'risk'
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    kpis: [] as KPI[],
    insights: [] as AIInsight[],
    isLoading: false,
    lastUpdated: null as Date | null
  }),

  getters: {
    criticalInsights: (state) => 
      state.insights.filter(insight => insight.priority === 'high'),
    
    revenueKPIs: (state) => 
      state.kpis.filter(kpi => kpi.id.includes('revenue')),
    
    formattedLastUpdate: (state) => 
      state.lastUpdated?.toLocaleString() || 'Never'
  },

  actions: {
    async fetchDashboardData() {
      this.isLoading = true
      try {
        // Simulate premium executive data
        this.kpis = [
          {
            id: 'revenue',
            title: 'Monthly Revenue',
            value: 2847500,
            change: 12.5,
            trend: 'up',
            format: 'currency'
          },
          {
            id: 'growth',
            title: 'Growth Rate',
            value: 23.8,
            change: 3.2,
            trend: 'up',
            format: 'percentage'
          },
          {
            id: 'customers',
            title: 'Active Customers',
            value: 15847,
            change: -2.1,
            trend: 'down',
            format: 'number'
          },
          {
            id: 'retention',
            title: 'Customer Retention',
            value: 94.2,
            change: 1.8,
            trend: 'up',
            format: 'percentage'
          }
        ]

        this.insights = [
          {
            id: '1',
            title: 'Revenue Acceleration Opportunity',
            description: 'AI analysis indicates 18% revenue increase potential through strategic customer segmentation.',
            confidence: 87,
            priority: 'high',
            category: 'revenue'
          },
          {
            id: '2',
            title: 'Market Expansion Signal',
            description: 'Emerging market trends suggest optimal timing for European expansion within Q2.',
            confidence: 92,
            priority: 'high',
            category: 'market'
          }
        ]

        this.lastUpdated = new Date()
      } finally {
        this.isLoading = false
      }
    },

    formatValue(value: number, format: string): string {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
          }).format(value)
        case 'percentage':
          return `${value}%`
        default:
          return new Intl.NumberFormat('en-US').format(value)
      }
    }
  }
})
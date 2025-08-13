<template>
  <v-app>
    <v-app-bar elevation="0" class="bg-transparent">
      <v-app-bar-title class="text-h5 font-weight-bold ml-4">
        <v-icon class="mr-3" size="32" color="primary">mdi-view-dashboard-variant</v-icon>
        StratosAI Command Center
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-chip class="mr-4" :color="isRealtime ? 'success' : 'warning'" variant="tonal">
        <v-icon start size="16">{{ isRealtime ? 'mdi-circle' : 'mdi-circle-outline' }}</v-icon>
        {{ isRealtime ? 'Live Data' : 'Offline' }}
      </v-chip>
      
      <ExportPanel class="mr-4" />
      <v-btn icon="mdi-account-circle" variant="text" class="mr-4" />
    </v-app-bar>

    <v-main class="pa-6">
      <v-container fluid>
        <!-- Executive Summary Header -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="text-center mb-4">
              <h1 class="text-h3 font-weight-bold mb-2" style="font-family: 'Playfair Display'">
                Executive Dashboard
              </h1>
              <p class="text-h6 text-medium-emphasis">
                Real-time insights powered by AI • Last updated: {{ formattedLastUpdate }}
              </p>
            </div>
          </v-col>
        </v-row>

        <!-- KPI Grid -->
        <v-row class="mb-8">
          <v-col
            v-for="kpi in kpis"
            :key="kpi.id"
            cols="12"
            sm="6"
            lg="3"
          >
            <ExecutiveKPI :kpi="kpi" />
          </v-col>
        </v-row>

        <!-- Live Stock Ticker -->
        <v-row class="mb-6">
          <v-col cols="12">
            <LiveStockTicker />
          </v-col>
        </v-row>

        <!-- Main Content Grid -->
        <v-row class="mb-6">
          <!-- Revenue Chart -->
          <v-col cols="12" lg="8">
            <RevenueChart />
          </v-col>

          <!-- AI Insights Panel -->
          <v-col cols="12" lg="4">
            <v-card class="executive-card" elevation="0">
              <v-card-title class="text-h6 font-weight-bold pb-4">
                <v-icon class="mr-2" color="primary">mdi-brain</v-icon>
                AI Strategic Insights
              </v-card-title>
              
              <v-card-text class="pa-0">
                <AIInsightCard
                  v-for="insight in criticalInsights"
                  :key="insight.id"
                  :insight="insight"
                />
                
                <div class="pa-6 pt-0">
                  <v-btn
                    block
                    variant="outlined"
                    color="primary"
                    class="font-weight-medium"
                  >
                    View All Insights
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Interactive Features Row -->
        <v-row class="mb-6">
          <!-- Global Operations Globe -->
          <v-col cols="12" lg="6">
            <GlobalOperationsGlobe />
          </v-col>
          
          <!-- Team Performance Radar -->
          <v-col cols="12" lg="6">
            <TeamPerformanceRadar />
          </v-col>
        </v-row>

        <!-- AI Analysis Row -->
        <v-row class="mb-6">
          <!-- Sentiment Analysis -->
          <v-col cols="12" lg="8">
            <SentimentAnalysisDashboard />
          </v-col>
          
          <!-- Voice Command Center -->
          <v-col cols="12" lg="4">
            <VoiceCommandCenter />
          </v-col>
        </v-row>

        <!-- Enhanced Performance Metrics -->
        <v-row>
          <v-col cols="12">
            <v-card class="executive-card performance-overview" elevation="0">
              <v-card-title class="text-h6 font-weight-bold">
                <v-icon class="mr-2" color="primary">mdi-chart-donut</v-icon>
                Executive Performance Overview
                <v-spacer />
                <v-btn variant="outlined" size="small" prepend-icon="mdi-refresh">
                  Real-time Update
                </v-btn>
              </v-card-title>
              
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="3">
                    <div class="metric-circle-container">
                      <div class="metric-circle success-metric">
                        <div class="metric-value">94.2%</div>
                        <div class="metric-label">Customer Satisfaction</div>
                        <div class="metric-trend">+2.3% ↗</div>
                      </div>
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="3">
                    <div class="metric-circle-container">
                      <div class="metric-circle primary-metric">
                        <div class="metric-value">87.5%</div>
                        <div class="metric-label">Operational Efficiency</div>
                        <div class="metric-trend">+1.8% ↗</div>
                      </div>
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="3">
                    <div class="metric-circle-container">
                      <div class="metric-circle warning-metric">
                        <div class="metric-value">76.8%</div>
                        <div class="metric-label">Market Share</div>
                        <div class="metric-trend">-0.5% ↘</div>
                      </div>
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="3">
                    <div class="metric-circle-container">
                      <div class="metric-circle info-metric">
                        <div class="metric-value">92.1%</div>
                        <div class="metric-label">AI Accuracy</div>
                        <div class="metric-trend">+4.2% ↗</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const dashboardStore = useDashboardStore()
const { kpis, insights, criticalInsights, formattedLastUpdate } = storeToRefs(dashboardStore)

const { isConnected: isRealtime } = useWebSocket()

onMounted(() => {
  dashboardStore.fetchDashboardData()
  dashboardStore.initializeRealtime()
})
</script>
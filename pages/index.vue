<template>
  <v-app>
    <v-app-bar elevation="0" class="bg-transparent">
      <v-app-bar-title class="text-h5 font-weight-bold ml-4">
        <v-icon class="mr-3" size="32" color="primary">mdi-view-dashboard-variant</v-icon>
        StratosAI Command Center
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-chip class="mr-4" color="success" variant="tonal">
        <v-icon start size="16">mdi-circle</v-icon>
        Live Data
      </v-chip>
      
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

        <!-- Main Content Grid -->
        <v-row>
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

        <!-- Performance Metrics -->
        <v-row class="mt-8">
          <v-col cols="12">
            <v-card class="executive-card" elevation="0">
              <v-card-title class="text-h6 font-weight-bold">
                Performance Overview
              </v-card-title>
              
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="text-center pa-4">
                      <v-progress-circular
                        :model-value="94.2"
                        size="120"
                        width="8"
                        color="success"
                        class="mb-4"
                      >
                        <span class="text-h5 font-weight-bold">94.2%</span>
                      </v-progress-circular>
                      <h4 class="text-h6 font-weight-medium">Customer Satisfaction</h4>
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="4">
                    <div class="text-center pa-4">
                      <v-progress-circular
                        :model-value="87.5"
                        size="120"
                        width="8"
                        color="primary"
                        class="mb-4"
                      >
                        <span class="text-h5 font-weight-bold">87.5%</span>
                      </v-progress-circular>
                      <h4 class="text-h6 font-weight-medium">Operational Efficiency</h4>
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="4">
                    <div class="text-center pa-4">
                      <v-progress-circular
                        :model-value="76.8"
                        size="120"
                        width="8"
                        color="warning"
                        class="mb-4"
                      >
                        <span class="text-h5 font-weight-bold">76.8%</span>
                      </v-progress-circular>
                      <h4 class="text-h6 font-weight-medium">Market Share</h4>
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

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>
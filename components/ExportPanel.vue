<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary" variant="outlined" prepend-icon="mdi-download">
        Export Report
      </v-btn>
    </template>
    
    <v-list>
      <v-list-item @click="exportPDF">
        <template #prepend>
          <v-icon>mdi-file-pdf-box</v-icon>
        </template>
        <v-list-item-title>Executive PDF</v-list-item-title>
      </v-list-item>
      
      <v-list-item @click="exportExcel">
        <template #prepend>
          <v-icon>mdi-file-excel</v-icon>
        </template>
        <v-list-item-title>Excel Data</v-list-item-title>
      </v-list-item>
      
      <v-list-item @click="exportJSON">
        <template #prepend>
          <v-icon>mdi-code-json</v-icon>
        </template>
        <v-list-item-title>Raw JSON</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const dashboardStore = useDashboardStore()

const exportPDF = () => {
  const data = {
    kpis: dashboardStore.kpis,
    insights: dashboardStore.insights,
    timestamp: new Date().toISOString()
  }
  
  const blob = new Blob([`Executive Report - ${new Date().toLocaleDateString()}\n\n${JSON.stringify(data, null, 2)}`], 
    { type: 'text/plain' })
  downloadFile(blob, 'executive-report.txt')
}

const exportExcel = () => {
  const csvData = dashboardStore.kpis.map(kpi => 
    `${kpi.title},${kpi.value},${kpi.change}%,${kpi.trend}`
  ).join('\n')
  
  const blob = new Blob([`Title,Value,Change,Trend\n${csvData}`], { type: 'text/csv' })
  downloadFile(blob, 'kpi-data.csv')
}

const exportJSON = () => {
  const data = {
    kpis: dashboardStore.kpis,
    insights: dashboardStore.insights,
    exportedAt: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadFile(blob, 'dashboard-data.json')
}

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
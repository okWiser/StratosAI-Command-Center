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

const { mockActions } = useMockActions()

const exportPDF = () => {
  mockActions.exportExecutiveReport()
}

const exportExcel = () => {
  mockActions.exportExecutiveReport()
}

const exportJSON = () => {
  mockActions.exportExecutiveReport()
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
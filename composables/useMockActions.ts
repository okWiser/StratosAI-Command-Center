export const useMockActions = () => {
  const showNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    // Mock notification system
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }
    
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`)
    
    // You could integrate with a real notification system here
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('mock-notification', { detail: notification })
      window.dispatchEvent(event)
    }
  }

  const mockActions = {
    // Executive Actions
    generateBoardPresentation: () => {
      showNotification(
        'Board Presentation Generated',
        'Executive summary with Q4 metrics and strategic recommendations ready for download.',
        'success'
      )
    },

    exportExecutiveReport: () => {
      showNotification(
        'Executive Report Exported',
        'Comprehensive business intelligence report exported to PDF format.',
        'success'
      )
    },

    // Office Actions
    openOfficeDetails: (office: any) => {
      showNotification(
        `${office.city} Office Details`,
        `Accessing detailed analytics for ${office.city} regional office with ${office.employees} employees.`,
        'info'
      )
    },

    contactOffice: (office: any) => {
      showNotification(
        `Connecting to ${office.city}`,
        `Initiating secure video conference with ${office.city} office leadership team.`,
        'info'
      )
    },

    // KPI Actions
    openKPIDrillDown: (kpi: any) => {
      showNotification(
        `${kpi.title} Deep Dive`,
        `Opening advanced analytics dashboard for ${kpi.title} with predictive modeling.`,
        'info'
      )
    },

    exportKPIData: (kpi: any) => {
      showNotification(
        `${kpi.title} Data Exported`,
        `Historical and forecasted data for ${kpi.title} exported to Excel format.`,
        'success'
      )
    },

    // AI Actions
    generateAIInsight: () => {
      showNotification(
        'AI Analysis Complete',
        'New strategic insights generated based on latest market data and performance metrics.',
        'success'
      )
    },

    executeVoiceCommand: (command: string) => {
      showNotification(
        'Voice Command Executed',
        `Processing: "${command}" - Results will be displayed momentarily.`,
        'info'
      )
    },

    // Network Actions
    analyzeNetworkHealth: () => {
      showNotification(
        'Network Analysis Complete',
        'All systems operational. 99.8% uptime across global infrastructure.',
        'success'
      )
    },

    // Market Actions
    updateMarketData: () => {
      showNotification(
        'Market Data Refreshed',
        'Real-time market intelligence updated with latest competitor analysis.',
        'info'
      )
    },

    // Security Actions
    runSecurityScan: () => {
      showNotification(
        'Security Scan Complete',
        'All systems secure. Zero threats detected. Quantum encryption active.',
        'success'
      )
    }
  }

  return {
    showNotification,
    mockActions
  }
}
<template>
  <div :data-theme="isDark ? 'dark' : 'light'" class="executive-app">
    <!-- Executive Header -->
    <div class="executive-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="stratos-logo">
            <div class="logo-icon">
              <div class="logo-core"></div>
            </div>
            <div class="logo-text">
              <div class="brand-name">StratosAI</div>
              <div class="brand-tagline">Executive Command Center</div>
            </div>
          </div>
        </div>

        <div class="executive-controls">
          <button @click="sendToEmail" class="email-btn">📧 Email Report</button>
          <div class="executive-profile-card" @click="toggleProfileDropdown">
            <div class="profile-glow"></div>
            <div class="profile-content">
              <div class="profile-avatar-container">
                <img :src="currentExecutive.avatar" :alt="currentExecutive.name" class="elite-avatar" />
                <div class="status-pulse"></div>
                <div class="clearance-badge">{{ currentExecutive.clearanceLevel }}</div>
              </div>
              <div class="profile-details">
                <div class="exec-name-elite">{{ currentExecutive.name }}</div>
                <div class="exec-title-elite">{{ currentExecutive.title }}</div>
                <div class="session-info">
                  <span class="session-dot"></span>
                  <span>Session: {{ sessionTime }}</span>
                </div>
              </div>
            </div>
          </div>
          <button @click="toggleTheme" class="theme-toggle">{{ isDark ? '☀️' : '🌙' }}</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Executive Summary -->
        <div class="executive-summary">
          <div class="summary-header">
            <h1 class="executive-title">Executive Command Center</h1>
            <div class="summary-meta">
              <div class="meta-item"><span>🛡️ Quantum Encrypted</span></div>
              <div class="meta-item"><span>🧠 AI Intelligence Active</span></div>
              <div class="meta-item"><span>🌍 Global Operations Live</span></div>
              <div class="meta-item"><span>⏰ Session: {{ sessionTime }}</span></div>
            </div>
          </div>
          
          <div class="executive-controls">
            <button @click="generateReport" class="btn-primary">📊 Board Presentation</button>
            <button @click="openAnalytics" class="btn-secondary">📈 Analytics Suite</button>
            <button @click="openSecurityCenter" class="btn-tertiary">🛡️ Security Center</button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.id" class="kpi-card" @click="showKPIDetails(kpi)">
            <div class="kpi-header">
              <div class="kpi-icon">{{ kpi.icon }}</div>
              <div class="kpi-title">{{ kpi.title }}</div>
              <button @click.stop="refreshKPI(kpi.id)" class="refresh-mini">🔄</button>
            </div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-change" :class="kpi.trend">
              {{ kpi.change > 0 ? '+' : '' }}{{ kpi.change }}%
            </div>
            <div class="last-updated">Updated: {{ formatTime(lastUpdated) }}</div>
          </div>
        </div>

        <!-- AI Assistant -->
        <div class="ai-assistant-section">
          <div class="section-title">ARIA - AI Executive Assistant</div>
          <div class="ai-container">
            <div class="chat-messages">
              <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
                <div class="message-avatar" v-if="message.type === 'ai'">
                  <div class="ai-avatar"><div class="ai-core"></div></div>
                </div>
                <div class="message-content">
                  <div class="message-text">{{ message.text }}</div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>
            </div>
            
            <div class="chat-input">
              <input v-model="currentMessage" @keyup.enter="sendMessage" placeholder="Ask ARIA about your business..." class="message-input" />
              <button @click="sendMessage" class="send-btn" :disabled="!currentMessage.trim()">📤</button>
            </div>
            
            <div class="quick-actions">
              <button v-for="action in quickActions" :key="action" @click="sendQuickMessage(action)" class="quick-btn">{{ action }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ modalData.title }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <!-- Email Modal -->
          <div v-if="modalData.component === 'email'" class="modal-content-wrapper">
            <div class="email-form">
              <div class="form-group">
                <label>To:</label>
                <input type="email" :value="modalData.data.recipient" readonly class="form-input" />
              </div>
              <div class="form-group">
                <label>Subject:</label>
                <input type="text" :value="modalData.data.subject" readonly class="form-input" />
              </div>
              <div class="form-group">
                <label>Message:</label>
                <textarea :value="modalData.data.content" readonly class="form-textarea"></textarea>
              </div>
              <div class="form-group">
                <label>Attachments:</label>
                <div class="attachments">
                  <div v-for="file in modalData.data.attachments" :key="file" class="attachment-item">
                    📄 {{ file }}
                  </div>
                </div>
              </div>
              <button @click="sendEmail" class="btn-primary">Send Email</button>
            </div>
          </div>

          <!-- Report Modal -->
          <div v-if="modalData.component === 'report'" class="modal-content-wrapper">
            <div class="report-overview">
              <h3>{{ modalData.data.title }}</h3>
              <div class="report-metrics">
                <div class="metric">
                  <span class="metric-label">Slides:</span>
                  <span class="metric-value">{{ modalData.data.metrics.slides }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Duration:</span>
                  <span class="metric-value">{{ modalData.data.metrics.duration }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Audience:</span>
                  <span class="metric-value">{{ modalData.data.metrics.audience }}</span>
                </div>
              </div>
              <div class="slides-preview">
                <div v-for="(slide, index) in modalData.data.slides" :key="index" class="slide-item">
                  <div class="slide-number">{{ index + 1 }}</div>
                  <div class="slide-content">
                    <h4>{{ slide.title }}</h4>
                    <p>{{ slide.content }}</p>
                  </div>
                </div>
              </div>
              <button @click="generatePresentationReport" class="btn-primary">Generate Presentation</button>
            </div>
          </div>

          <!-- Analytics Modal -->
          <div v-if="modalData.component === 'analytics'" class="modal-content-wrapper">
            <div class="analytics-dashboard">
              <h3>Live Analytics Dashboards</h3>
              <div class="dashboard-grid">
                <div v-for="dashboard in modalData.data.dashboards" :key="dashboard.name" class="dashboard-item">
                  <div class="dashboard-status" :class="dashboard.status.toLowerCase()">•</div>
                  <div class="dashboard-info">
                    <h4>{{ dashboard.name }}</h4>
                    <p>{{ dashboard.lastUpdate }}</p>
                  </div>
                </div>
              </div>
              <h3>Key Insights</h3>
              <div class="insights-list">
                <div v-for="insight in modalData.data.insights" :key="insight" class="insight-item">
                  💡 {{ insight }}
                </div>
              </div>
              <button @click="openFullAnalytics" class="btn-secondary">Open Full Analytics</button>
            </div>
          </div>

          <!-- Security Modal -->
          <div v-if="modalData.component === 'security'" class="modal-content-wrapper">
            <div class="security-center">
              <div class="security-status">
                <div class="status-indicator" :class="modalData.data.status.toLowerCase()">
                  🛡️ {{ modalData.data.status }}
                </div>
                <div class="clearance-level">
                  Clearance: {{ modalData.data.clearanceLevel }}
                </div>
              </div>
              <div class="threat-summary">
                <h3>Threat Summary</h3>
                <div class="threat-stats">
                  <div class="stat">
                    <span class="stat-number">{{ modalData.data.threats.blocked }}</span>
                    <span class="stat-label">Blocked</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">{{ modalData.data.threats.monitored }}</span>
                    <span class="stat-label">Monitored</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">{{ modalData.data.threats.resolved }}</span>
                    <span class="stat-label">Resolved</span>
                  </div>
                </div>
              </div>
              <div class="security-systems">
                <h3>Security Systems</h3>
                <div v-for="system in modalData.data.systems" :key="system.name" class="system-item">
                  <div class="system-status active">•</div>
                  <div class="system-info">
                    <h4>{{ system.name }}</h4>
                    <p>{{ system.level }}</p>
                  </div>
                </div>
              </div>
              <button @click="runSecurityScan" class="btn-tertiary">Run Security Scan</button>
            </div>
          </div>

          <!-- KPI Modal -->
          <div v-if="modalData.component === 'kpi'" class="modal-content-wrapper">
            <div class="kpi-details">
              <div class="kpi-header-detail">
                <div class="kpi-icon-large">{{ modalData.data.icon }}</div>
                <div class="kpi-info">
                  <h3>{{ modalData.data.title }}</h3>
                  <div class="kpi-value-large">{{ modalData.data.value }}</div>
                  <div class="kpi-change-large" :class="modalData.data.trend">
                    {{ modalData.data.change > 0 ? '+' : '' }}{{ modalData.data.change }}%
                  </div>
                </div>
              </div>
              <div class="kpi-breakdown" v-if="modalData.data.details.breakdown && modalData.data.details.breakdown.length">
                <h4>Breakdown</h4>
                <div v-for="item in modalData.data.details.breakdown" :key="item.source || item.factor" class="breakdown-item">
                  <span class="breakdown-label">{{ item.source || item.factor }}</span>
                  <span class="breakdown-value">{{ item.amount || item.impact }}</span>
                  <span class="breakdown-percent" v-if="item.percentage">{{ item.percentage }}%</span>
                </div>
              </div>
              <div class="kpi-factors" v-if="modalData.data.details.factors">
                <h4>Growth Factors</h4>
                <div v-for="factor in modalData.data.details.factors" :key="factor.factor" class="factor-item">
                  <span class="factor-label">{{ factor.factor }}</span>
                  <span class="factor-impact">{{ factor.impact }}</span>
                </div>
              </div>
              <button @click="exportKPIReport" class="btn-primary">Export Report</button>
            </div>
          </div>

          <!-- Profile Modal -->
          <div v-if="modalData.component === 'profile'" class="modal-content-wrapper">
            <div class="profile-details">
              <div class="profile-header-detail">
                <img :src="modalData.data.avatar" :alt="modalData.data.name" class="profile-avatar-large" />
                <div class="profile-info-detail">
                  <h3>{{ modalData.data.name }}</h3>
                  <p class="profile-title">{{ modalData.data.title }}</p>
                  <div class="profile-meta">
                    <div class="meta-item">📍 {{ modalData.data.details.location }}</div>
                    <div class="meta-item">🏢 {{ modalData.data.details.department }}</div>
                    <div class="meta-item">⏱️ {{ modalData.data.details.tenure }}</div>
                    <div class="meta-item">🛡️ {{ modalData.data.clearanceLevel }}</div>
                  </div>
                </div>
              </div>
              <div class="achievements-section">
                <h4>Key Achievements</h4>
                <div v-for="achievement in modalData.data.details.achievements" :key="achievement" class="achievement-item">
                  🏆 {{ achievement }}
                </div>
              </div>
              <div class="certifications-section">
                <h4>Certifications</h4>
                <div v-for="cert in modalData.data.details.certifications" :key="cert" class="certification-item">
                  🎓 {{ cert }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject, provide } from 'vue'

// Reactive state
const isDark = inject('isDark', ref(true))
const toggleThemeGlobal = inject('toggleTheme', () => {})
const isLoading = ref(false)
const showModal = ref(false)
const currentMessage = ref('')
const lastUpdated = ref(new Date())
const sessionTime = ref('14:32:07')

// Executive data
const currentExecutive = reactive({
  name: 'Wisani Chauke',
  title: 'Chief Executive Officer',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  clearanceLevel: 'OMEGA'
})

// Modal system
const modalData = reactive({
  title: '',
  component: null,
  data: {}
})

// KPI data
const kpis = reactive([
  { id: 1, icon: '💰', title: 'Revenue', value: '$2.4M', change: 12.5, trend: 'positive' },
  { id: 2, icon: '📈', title: 'Growth', value: '18.2%', change: 3.1, trend: 'positive' },
  { id: 3, icon: '👥', title: 'Users', value: '847K', change: -2.3, trend: 'negative' },
  { id: 4, icon: '🎯', title: 'Conversion', value: '4.8%', change: 0.7, trend: 'positive' }
])

// AI Messages
const messages = reactive([
  { id: 1, type: 'ai', text: 'Good afternoon, Mr. Chauke. Revenue is up 12.5% this quarter.', time: '14:30' },
  { id: 2, type: 'user', text: 'Show me the quarterly projections', time: '14:31' },
  { id: 3, type: 'ai', text: 'Based on current trends, Q4 projections show $3.2M potential revenue.', time: '14:32' }
])

const quickActions = ['Market Analysis', 'Competitor Intel', 'Risk Assessment', 'Growth Opportunities']

// Mock Data
const mockData = {
  emailReport: {
    recipient: 'wisanichauke@stratosai.com',
    subject: 'StratosAI Executive Dashboard - Q4 2024 Report',
    content: `Dear Mr. Chauke,

Attached is your comprehensive executive report for Q4 2024:

📊 Key Metrics:
• Revenue: $2.4M (+12.5%)
• Growth Rate: 18.2% (+3.1%)
• Active Users: 847K (-2.3%)
• Conversion Rate: 4.8% (+0.7%)

🎯 Strategic Highlights:
• Market expansion into 3 new regions
• AI integration boosted efficiency by 24%
• Customer satisfaction at all-time high of 94%

Best regards,
ARIA AI Assistant`,
    attachments: ['Q4_Financial_Report.pdf', 'Market_Analysis.xlsx', 'Performance_Metrics.pdf']
  },
  boardPresentation: {
    title: 'Q4 2024 Board Presentation',
    slides: [
      { title: 'Executive Summary', content: 'Revenue up 12.5%, expanding into new markets' },
      { title: 'Financial Performance', content: '$2.4M revenue with strong growth trajectory' },
      { title: 'Market Position', content: 'Leading AI solutions provider in enterprise sector' },
      { title: 'Strategic Initiatives', content: 'AI integration, global expansion, talent acquisition' },
      { title: 'Q1 2025 Outlook', content: 'Projected 25% growth with new product launches' }
    ],
    metrics: { slides: 15, duration: '45 min', audience: 'Board of Directors' }
  },
  analytics: {
    dashboards: [
      { name: 'Revenue Analytics', status: 'Live', lastUpdate: '2 min ago' },
      { name: 'User Engagement', status: 'Live', lastUpdate: '5 min ago' },
      { name: 'Market Intelligence', status: 'Live', lastUpdate: '1 min ago' },
      { name: 'Operational Metrics', status: 'Live', lastUpdate: '3 min ago' }
    ],
    insights: [
      'Revenue trending 15% above forecast',
      'User retention improved by 8% this quarter',
      'Market share increased to 23.4%',
      'Operational efficiency up 12%'
    ]
  },
  security: {
    status: 'SECURE',
    clearanceLevel: 'OMEGA',
    threats: {
      blocked: 1247,
      monitored: 23,
      resolved: 1224
    },
    systems: [
      { name: 'Firewall', status: 'Active', level: 'Maximum' },
      { name: 'Encryption', status: 'Active', level: 'AES-256' },
      { name: 'Access Control', status: 'Active', level: 'Multi-Factor' },
      { name: 'Monitoring', status: 'Active', level: '24/7 SOC' }
    ]
  },
  kpiDetails: {
    revenue: {
      current: '$2.4M',
      target: '$2.1M',
      variance: '+14.3%',
      breakdown: [
        { source: 'Enterprise Licenses', amount: '$1.2M', percentage: 50 },
        { source: 'Professional Services', amount: '$720K', percentage: 30 },
        { source: 'Cloud Solutions', amount: '$480K', percentage: 20 }
      ]
    },
    growth: {
      current: '18.2%',
      target: '15.0%',
      variance: '+3.2%',
      factors: [
        { factor: 'New Customer Acquisition', impact: '+8.5%' },
        { factor: 'Upselling Existing Clients', impact: '+6.2%' },
        { factor: 'Market Expansion', impact: '+3.5%' }
      ]
    }
  }
}

// Methods
const toggleTheme = () => {
  toggleThemeGlobal()
}

const sendToEmail = () => {
  showModalWithData('📧 Email Report', 'email', mockData.emailReport)
}

const generateReport = () => {
  showModalWithData('📊 Board Presentation', 'report', mockData.boardPresentation)
}

const openAnalytics = () => {
  showModalWithData('📈 Analytics Suite', 'analytics', mockData.analytics)
}

const openSecurityCenter = () => {
  showModalWithData('🛡️ Security Center', 'security', mockData.security)
}

const showKPIDetails = (kpi) => {
  const kpiData = {
    ...kpi,
    details: mockData.kpiDetails[kpi.title.toLowerCase()] || {
      current: kpi.value,
      target: 'N/A',
      variance: `${kpi.change}%`,
      breakdown: []
    }
  }
  showModalWithData(`${kpi.title} Details`, 'kpi', kpiData)
}

const refreshKPI = (id) => {
  const kpi = kpis.find(k => k.id === id)
  if (kpi) {
    kpi.change = (Math.random() * 20 - 10).toFixed(1)
    kpi.trend = kpi.change > 0 ? 'positive' : 'negative'
  }
}

const sendMessage = () => {
  if (!currentMessage.value.trim()) return
  
  messages.push({
    id: Date.now(),
    type: 'user',
    text: currentMessage.value,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  })
  
  currentMessage.value = ''
  
  // Simulate AI response
  setTimeout(() => {
    messages.push({
      id: Date.now(),
      type: 'ai',
      text: 'I understand your request. Let me analyze the data and provide insights.',
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    })
  }, 1000)
}

const sendQuickMessage = (action) => {
  currentMessage.value = action
  sendMessage()
}

const showModalWithData = (title, component, data) => {
  modalData.title = title
  modalData.component = component
  modalData.data = data
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const toggleProfileDropdown = () => {
  showModalWithData('👤 Executive Profile', 'profile', {
    ...currentExecutive,
    details: {
      department: 'Executive Leadership',
      location: 'Johannesburg, South Africa',
      tenure: '3 years',
      achievements: [
        'Led 300% revenue growth in 2 years',
        'Expanded operations to 12 countries',
        'Implemented AI-first strategy',
        'Built world-class executive team'
      ],
      certifications: ['MBA - Wits Business School', 'AI Leadership Certificate', 'Executive Leadership Program']
    }
  })
}

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { hour12: false })
}

// Modal Action Methods
const sendEmail = () => {
  alert(`Email sent successfully to ${modalData.data.recipient}!\n\nReport delivered with attachments:\n${modalData.data.attachments.join('\n')}`)
  closeModal()
}

const generatePresentationReport = () => {
  alert(`Board presentation generated successfully!\n\n${modalData.data.metrics.slides} slides ready for ${modalData.data.metrics.audience}\nEstimated duration: ${modalData.data.metrics.duration}`)
  closeModal()
}

const openFullAnalytics = () => {
  alert('Opening full analytics suite...\n\nAll dashboards are live and updating in real-time.\nKey insights have been highlighted for your review.')
  closeModal()
}

const runSecurityScan = () => {
  alert(`Security scan initiated...\n\nCurrent Status: ${modalData.data.status}\nClearance Level: ${modalData.data.clearanceLevel}\n\nAll systems operational and secure.`)
  closeModal()
}

const exportKPIReport = () => {
  alert(`${modalData.data.title} report exported successfully!\n\nCurrent Value: ${modalData.data.value}\nTrend: ${modalData.data.change > 0 ? 'Positive' : 'Negative'} (${modalData.data.change}%)\n\nDetailed breakdown included in export.`)
  closeModal()
}

// Lifecycle
onMounted(() => {
  // Update session time every second
  setInterval(() => {
    sessionTime.value = new Date().toLocaleTimeString('en-US', { hour12: false })
  }, 1000)
  
  // Update last updated time
  setInterval(() => {
    lastUpdated.value = new Date()
  }, 30000)
})
</script>

<style lang="scss" scoped>
.executive-app {
  min-height: 100vh;
  background: var(--theme-background);
  color: var(--theme-text);
  font-family: 'Inter', sans-serif;
}

.executive-header {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--theme-border);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stratos-logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: var(--royal-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--gold-glow);
}

.logo-core {
  width: 24px;
  height: 24px;
  background: var(--luxe-gold);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.brand-name {
  font-size: 24px;
  font-weight: 800;
  color: var(--theme-text);
  font-family: 'Playfair Display', serif;
}

.brand-tagline {
  font-size: 12px;
  color: var(--luxe-gold);
  font-weight: 600;
}

.executive-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.email-btn, .theme-toggle {
  padding: 8px 16px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  color: var(--theme-text);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--royal-gradient);
    color: white;
    transform: translateY(-2px);
  }
}

.executive-profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(212, 175, 55, 0.1);
    border-color: var(--luxe-gold);
    transform: translateY(-2px);
  }
}

.profile-avatar-container {
  position: relative;
}

.elite-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--luxe-gold);
}

.clearance-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--royal-gradient);
  color: white;
  font-size: 8px;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 700;
}

.exec-name-elite {
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-text);
}

.exec-title-elite {
  font-size: 11px;
  color: var(--luxe-gold);
  font-weight: 600;
}

.session-info {
  font-size: 10px;
  color: var(--theme-textSecondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.session-dot {
  width: 6px;
  height: 6px;
  background: var(--luxe-emerald);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.main-content {
  padding: 32px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.executive-summary {
  margin-bottom: 32px;
  text-align: center;
}

.executive-title {
  font-size: 48px;
  font-weight: 800;
  color: var(--theme-text);
  margin: 0 0 16px 0;
  font-family: 'Playfair Display', serif;
}

.summary-meta {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.meta-item {
  padding: 8px 16px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.executive-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-tertiary {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background: var(--royal-gradient);
  color: white;
  box-shadow: var(--gold-glow);
}

.btn-secondary {
  background: var(--emerald-gradient);
  color: white;
  box-shadow: var(--emerald-glow);
}

.btn-tertiary {
  background: var(--sapphire-gradient);
  color: white;
  box-shadow: var(--sapphire-glow);
}

.btn-primary:hover, .btn-secondary:hover, .btn-tertiary:hover {
  transform: translateY(-2px);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.kpi-card {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--luxe-gold);
    box-shadow: var(--gold-glow);
  }
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.kpi-icon {
  font-size: 24px;
}

.kpi-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-textSecondary);
  flex: 1;
}

.refresh-mini {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  opacity: 0.6;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    transform: rotate(180deg);
  }
}

.kpi-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--theme-text);
  margin-bottom: 8px;
  font-family: 'Playfair Display', serif;
}

.kpi-change {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  
  &.positive {
    color: var(--luxe-emerald);
  }
  
  &.negative {
    color: #ff4757;
  }
}

.last-updated {
  font-size: 11px;
  color: var(--theme-textSecondary);
}

.ai-assistant-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 20px;
  text-align: center;
}

.ai-container {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 16px;
  padding: 24px;
}

.chat-messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  &.user {
    flex-direction: row-reverse;
  }
}

.ai-avatar {
  width: 32px;
  height: 32px;
  background: var(--royal-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-core {
  width: 16px;
  height: 16px;
  background: var(--luxe-gold);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-text {
  background: var(--theme-glass);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--theme-border);
  font-size: 14px;
  line-height: 1.5;
}

.message-time {
  font-size: 11px;
  color: var(--theme-textSecondary);
  margin-top: 4px;
  text-align: right;
}

.chat-input {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  color: var(--theme-text);
  font-size: 14px;
  
  &::placeholder {
    color: var(--theme-textSecondary);
  }
  
  &:focus {
    outline: none;
    border-color: var(--luxe-gold);
  }
}

.send-btn {
  padding: 12px 16px;
  background: var(--royal-gradient);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 6px 12px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 6px;
  color: var(--theme-text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--luxe-gold);
    color: var(--luxe-obsidian);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--theme-border);
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--theme-text);
    margin: 0;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--theme-textSecondary);
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: var(--theme-text);
  }
}

.modal-body {
  padding: 24px;
}

// Modal Content Styles
.modal-content-wrapper {
  max-height: 60vh;
  overflow-y: auto;
}

.email-form {
  .form-group {
    margin-bottom: 16px;
    
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--theme-text);
    }
    
    .form-input, .form-textarea {
      width: 100%;
      padding: 8px 12px;
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 6px;
      color: var(--theme-text);
      font-size: 14px;
    }
    
    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }
  }
  
  .attachments {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .attachment-item {
      padding: 4px 8px;
      background: var(--theme-glass);
      border-radius: 4px;
      font-size: 12px;
      color: var(--theme-textSecondary);
    }
  }
}

.report-overview {
  .report-metrics {
    display: flex;
    gap: 16px;
    margin: 16px 0;
    
    .metric {
      flex: 1;
      padding: 12px;
      background: var(--theme-glass);
      border-radius: 8px;
      text-align: center;
      
      .metric-label {
        display: block;
        font-size: 12px;
        color: var(--theme-textSecondary);
      }
      
      .metric-value {
        font-weight: 700;
        color: var(--luxe-gold);
      }
    }
  }
  
  .slides-preview {
    margin: 16px 0;
    
    .slide-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      margin-bottom: 8px;
      background: var(--theme-glass);
      border-radius: 8px;
      
      .slide-number {
        width: 24px;
        height: 24px;
        background: var(--luxe-gold);
        color: var(--luxe-obsidian);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
      }
      
      .slide-content {
        flex: 1;
        
        h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: var(--theme-text);
        }
        
        p {
          margin: 0;
          font-size: 12px;
          color: var(--theme-textSecondary);
        }
      }
    }
  }
}

.analytics-dashboard {
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 16px 0;
    
    .dashboard-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: var(--theme-glass);
      border-radius: 8px;
      
      .dashboard-status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.live {
          background: var(--luxe-emerald);
          box-shadow: 0 0 8px var(--luxe-emerald);
        }
      }
      
      .dashboard-info {
        h4 {
          margin: 0;
          font-size: 14px;
          color: var(--theme-text);
        }
        
        p {
          margin: 0;
          font-size: 11px;
          color: var(--theme-textSecondary);
        }
      }
    }
  }
  
  .insights-list {
    .insight-item {
      padding: 8px 12px;
      margin-bottom: 8px;
      background: var(--theme-glass);
      border-radius: 6px;
      font-size: 13px;
      color: var(--theme-text);
    }
  }
}

.security-center {
  .security-status {
    text-align: center;
    margin-bottom: 24px;
    
    .status-indicator {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      
      &.secure {
        color: var(--luxe-emerald);
      }
    }
    
    .clearance-level {
      font-size: 12px;
      color: var(--luxe-gold);
      font-weight: 600;
    }
  }
  
  .threat-stats {
    display: flex;
    gap: 16px;
    margin: 16px 0;
    
    .stat {
      flex: 1;
      text-align: center;
      padding: 12px;
      background: var(--theme-glass);
      border-radius: 8px;
      
      .stat-number {
        display: block;
        font-size: 20px;
        font-weight: 800;
        color: var(--luxe-gold);
      }
      
      .stat-label {
        font-size: 11px;
        color: var(--theme-textSecondary);
        text-transform: uppercase;
      }
    }
  }
  
  .security-systems {
    .system-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      margin-bottom: 8px;
      background: var(--theme-glass);
      border-radius: 8px;
      
      .system-status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.active {
          background: var(--luxe-emerald);
          box-shadow: 0 0 8px var(--luxe-emerald);
        }
      }
      
      .system-info {
        h4 {
          margin: 0;
          font-size: 14px;
          color: var(--theme-text);
        }
        
        p {
          margin: 0;
          font-size: 11px;
          color: var(--theme-textSecondary);
        }
      }
    }
  }
}

.kpi-details {
  .kpi-header-detail {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    
    .kpi-icon-large {
      font-size: 48px;
    }
    
    .kpi-info {
      flex: 1;
      
      h3 {
        margin: 0 0 8px 0;
        color: var(--theme-text);
      }
      
      .kpi-value-large {
        font-size: 32px;
        font-weight: 800;
        color: var(--luxe-gold);
        margin-bottom: 4px;
      }
      
      .kpi-change-large {
        font-size: 16px;
        font-weight: 600;
        
        &.positive {
          color: var(--luxe-emerald);
        }
        
        &.negative {
          color: #ff4757;
        }
      }
    }
  }
  
  .kpi-breakdown, .kpi-factors {
    margin-bottom: 20px;
    
    h4 {
      margin: 0 0 12px 0;
      color: var(--theme-text);
    }
    
    .breakdown-item, .factor-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 6px;
      background: var(--theme-glass);
      border-radius: 6px;
      
      .breakdown-label, .factor-label {
        font-size: 13px;
        color: var(--theme-text);
      }
      
      .breakdown-value, .factor-impact {
        font-weight: 600;
        color: var(--luxe-gold);
      }
      
      .breakdown-percent {
        font-size: 11px;
        color: var(--theme-textSecondary);
      }
    }
  }
}

.profile-details {
  .profile-header-detail {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    
    .profile-avatar-large {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid var(--luxe-gold);
    }
    
    .profile-info-detail {
      flex: 1;
      
      h3 {
        margin: 0 0 4px 0;
        color: var(--theme-text);
      }
      
      .profile-title {
        color: var(--luxe-gold);
        font-weight: 600;
        margin-bottom: 12px;
      }
      
      .profile-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        
        .meta-item {
          font-size: 12px;
          color: var(--theme-textSecondary);
        }
      }
    }
  }
  
  .achievements-section, .certifications-section {
    margin-bottom: 20px;
    
    h4 {
      margin: 0 0 12px 0;
      color: var(--theme-text);
    }
    
    .achievement-item, .certification-item {
      padding: 8px 12px;
      margin-bottom: 6px;
      background: var(--theme-glass);
      border-radius: 6px;
      font-size: 13px;
      color: var(--theme-text);
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .executive-title {
    font-size: 32px;
  }
  
  .summary-meta {
    flex-direction: column;
    align-items: center;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
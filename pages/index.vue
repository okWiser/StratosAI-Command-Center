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

        <!-- Executive Decision Engine -->
        <div class="decision-engine-section">
          <div class="section-title">
            <span class="engine-icon">🧠</span>
            EXECUTIVE DECISION ENGINE
            <div class="ai-status">AI ACTIVE</div>
          </div>
          
          <div class="decision-interface">
            <!-- Strategic Decision Input -->
            <div class="decision-input-panel">
              <h3>Strategic Decision Input</h3>
              <div class="decision-form">
                <select v-model="selectedDecisionType" class="decision-select">
                  <option value="">Select Decision Type</option>
                  <option v-for="type in decisionTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>
                
                <div v-if="selectedDecisionType" class="decision-details">
                  <input v-model="decisionAmount" type="number" :placeholder="getDecisionPlaceholder()" class="decision-amount" />
                  <textarea v-model="decisionContext" :placeholder="getContextPlaceholder()" class="decision-context"></textarea>
                  
                  <button @click="analyzeDecision" class="analyze-btn" :disabled="!canAnalyze">
                    <span class="btn-icon">⚡</span>
                    ANALYZE GLOBAL IMPACT
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Real-time Impact Visualization -->
            <div v-if="showImpactAnalysis" class="impact-visualization">
              <h3>Global Impact Analysis</h3>
              
              <!-- Impact Metrics -->
              <div class="impact-metrics">
                <div v-for="metric in impactMetrics" :key="metric.name" class="impact-metric" :class="metric.trend">
                  <div class="metric-icon">{{ metric.icon }}</div>
                  <div class="metric-info">
                    <div class="metric-name">{{ metric.name }}</div>
                    <div class="metric-value">{{ metric.value }}</div>
                    <div class="metric-change">{{ metric.change }}</div>
                  </div>
                  <div class="metric-chart">
                    <div class="chart-bar" :style="{ height: metric.intensity + '%' }"></div>
                  </div>
                </div>
              </div>
              
              <!-- Global Ripple Effect -->
              <div class="ripple-effect">
                <h4>Ripple Effect Analysis</h4>
                <div class="ripple-map">
                  <div class="ripple-center" @click="showRippleDetails">
                    <div class="decision-epicenter">{{ selectedDecisionType }}</div>
                    <div class="ripple-wave" v-for="i in 3" :key="i" :style="{ animationDelay: (i * 0.5) + 's' }"></div>
                  </div>
                  
                  <div v-for="effect in rippleEffects" :key="effect.id" class="ripple-node" :style="effect.position">
                    <div class="node-icon">{{ effect.icon }}</div>
                    <div class="node-label">{{ effect.label }}</div>
                    <div class="node-impact" :class="effect.impact">{{ effect.value }}</div>
                  </div>
                </div>
              </div>
              
              <!-- AI Recommendations -->
              <div class="ai-recommendations">
                <h4>AI Strategic Recommendations</h4>
                <div class="recommendations-list">
                  <div v-for="rec in aiRecommendations" :key="rec.id" class="recommendation-item" :class="rec.priority">
                    <div class="rec-priority">{{ rec.priority.toUpperCase() }}</div>
                    <div class="rec-content">
                      <div class="rec-title">{{ rec.title }}</div>
                      <div class="rec-description">{{ rec.description }}</div>
                      <div class="rec-impact">Expected Impact: {{ rec.expectedImpact }}</div>
                    </div>
                    <button @click="executeRecommendation(rec)" class="execute-btn">
                      EXECUTE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Executive Time Machine -->
        <div class="time-machine-section">
          <div class="section-title">
            <span class="time-icon">⏰</span>
            EXECUTIVE TIME MACHINE
            <div class="quantum-status">QUANTUM ACTIVE</div>
          </div>
          
          <div class="time-machine-interface">
            <div class="timeline-selector">
              <h3>Navigate Business Timeline</h3>
              <div class="timeline-controls">
                <button v-for="period in timePeriods" :key="period.id" @click="travelToTime(period)" class="time-btn" :class="{ active: selectedPeriod === period.id }">
                  {{ period.label }}
                </button>
              </div>
            </div>
            
            <div v-if="timeData" class="time-visualization">
              <div class="time-portal">
                <div class="portal-ring" v-for="i in 5" :key="i" :style="{ animationDelay: (i * 0.2) + 's' }"></div>
                <div class="portal-center">
                  <div class="time-display">{{ timeData.period }}</div>
                  <div class="time-subtitle">{{ timeData.subtitle }}</div>
                </div>
              </div>
              
              <div class="time-metrics">
                <div v-for="metric in timeData.metrics" :key="metric.name" class="time-metric">
                  <div class="metric-label">{{ metric.name }}</div>
                  <div class="metric-value">{{ metric.value }}</div>
                  <div class="metric-trend" :class="metric.trend">{{ metric.change }}</div>
                </div>
              </div>
              
              <div class="time-insights">
                <h4>{{ timeData.period }} Insights</h4>
                <div v-for="insight in timeData.insights" :key="insight" class="time-insight">
                  💡 {{ insight }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Executive War Room -->
        <div class="war-room-section">
          <div class="section-title">
            <span class="war-icon">⚔️</span>
            EXECUTIVE WAR ROOM
            <div class="battle-status">BATTLE READY</div>
          </div>
          
          <div class="war-room-interface">
            <div class="threat-radar">
              <h3>Competitive Threat Radar</h3>
              <div class="radar-display">
                <div class="radar-sweep"></div>
                <div class="radar-grid">
                  <div class="grid-line horizontal" v-for="i in 4" :key="'h' + i"></div>
                  <div class="grid-line vertical" v-for="i in 4" :key="'v' + i"></div>
                </div>
                <div v-for="threat in competitiveThreats" :key="threat.id" class="threat-blip" :style="threat.position" :class="threat.severity">
                  <div class="blip-dot"></div>
                  <div class="blip-label">{{ threat.name }}</div>
                </div>
              </div>
            </div>
            
            <div class="battle-commands">
              <h3>Strategic Battle Commands</h3>
              <div class="command-grid">
                <button v-for="command in battleCommands" :key="command.id" @click="executeCommand(command)" class="command-btn" :class="command.type">
                  <div class="command-icon">{{ command.icon }}</div>
                  <div class="command-name">{{ command.name }}</div>
                  <div class="command-power">{{ command.power }}</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Executive Crystal Ball -->
        <div class="crystal-ball-section">
          <div class="section-title">
            <span class="crystal-icon">🔮</span>
            EXECUTIVE CRYSTAL BALL
            <div class="prophecy-status">PROPHECY ACTIVE</div>
          </div>
          
          <div class="crystal-interface">
            <div class="crystal-ball" @click="generateProphecy">
              <div class="crystal-sphere">
                <div class="crystal-glow"></div>
                <div class="crystal-swirl" v-for="i in 3" :key="i" :style="{ animationDelay: (i * 0.8) + 's' }"></div>
                <div class="crystal-center">ASK</div>
              </div>
            </div>
            
            <div v-if="prophecy" class="prophecy-display">
              <h3>The Crystal Ball Reveals...</h3>
              <div class="prophecy-content">
                <div class="prophecy-text">{{ prophecy.prediction }}</div>
                <div class="prophecy-confidence">Confidence: {{ prophecy.confidence }}%</div>
                <div class="prophecy-timeline">Timeline: {{ prophecy.timeline }}</div>
              </div>
              
              <div class="prophecy-actions">
                <h4>Recommended Actions</h4>
                <div v-for="action in prophecy.actions" :key="action" class="prophecy-action">
                  ⚡ {{ action }}
                </div>
              </div>
            </div>
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
        
        <!-- Executive Mission Control -->
        <div class="mission-control-section">
          <div class="section-title">
            <span class="mission-icon">🚀</span>
            EXECUTIVE MISSION CONTROL
            <div class="launch-status">LAUNCH READY</div>
          </div>
          
          <div class="mission-interface">
            <div class="mission-grid">
              <!-- Launch Pad -->
              <div class="launch-pad">
                <h3>Strategic Launch Pad</h3>
                <div class="rocket-display">
                  <div class="rocket" @click="launchMission">
                    <div class="rocket-body"></div>
                    <div class="rocket-flames" v-if="isLaunching">
                      <div class="flame" v-for="i in 3" :key="i"></div>
                    </div>
                  </div>
                  <div class="launch-platform"></div>
                </div>
                <div class="launch-controls">
                  <select v-model="selectedMission" class="mission-select">
                    <option value="">Select Mission</option>
                    <option v-for="mission in missions" :key="mission.id" :value="mission.id">{{ mission.name }}</option>
                  </select>
                  <button @click="initiateLaunch" :disabled="!selectedMission" class="launch-btn">
                    🚀 INITIATE LAUNCH
                  </button>
                </div>
              </div>
              
              <!-- Mission Status -->
              <div class="mission-status">
                <h3>Active Missions</h3>
                <div class="missions-list">
                  <div v-for="mission in activeMissions" :key="mission.id" class="mission-item" :class="mission.status">
                    <div class="mission-icon">{{ mission.icon }}</div>
                    <div class="mission-info">
                      <div class="mission-name">{{ mission.name }}</div>
                      <div class="mission-progress">
                        <div class="progress-bar">
                          <div class="progress-fill" :style="{ width: mission.progress + '%' }"></div>
                        </div>
                        <span class="progress-text">{{ mission.progress }}%</span>
                      </div>
                      <div class="mission-eta">ETA: {{ mission.eta }}</div>
                    </div>
                    <div class="mission-status-indicator" :class="mission.status"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Command Console -->
            <div class="command-console">
              <h3>Executive Command Console</h3>
              <div class="console-display">
                <div class="console-line" v-for="(log, index) in commandLogs" :key="index" :class="log.type">
                  <span class="timestamp">[{{ log.timestamp }}]</span>
                  <span class="message">{{ log.message }}</span>
                </div>
              </div>
              <div class="console-input">
                <input v-model="commandInput" @keyup.enter="executeMissionCommand" placeholder="Enter executive command..." class="command-input" />
                <button @click="executeMissionCommand" class="execute-btn">EXECUTE</button>
              </div>
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

// Executive Decision Engine
const selectedDecisionType = ref('')
const decisionAmount = ref('')
const decisionContext = ref('')
const showImpactAnalysis = ref(false)

const decisionTypes = [
  { id: 'acquisition', name: 'Strategic Acquisition', placeholder: 'Acquisition amount ($M)', context: 'Target company and strategic rationale...' },
  { id: 'expansion', name: 'Market Expansion', placeholder: 'Investment amount ($M)', context: 'Target markets and expansion strategy...' },
  { id: 'product', name: 'Product Launch', placeholder: 'Launch budget ($M)', context: 'Product details and market positioning...' },
  { id: 'restructure', name: 'Organizational Restructure', placeholder: 'Affected employees', context: 'Restructuring goals and timeline...' },
  { id: 'investment', name: 'R&D Investment', placeholder: 'Investment amount ($M)', context: 'Research focus and expected outcomes...' }
]

const impactMetrics = reactive([
  { name: 'Revenue Impact', icon: '💰', value: '+$0M', change: '0%', trend: 'neutral', intensity: 0 },
  { name: 'Market Share', icon: '🌍', value: '0%', change: '0%', trend: 'neutral', intensity: 0 },
  { name: 'Employee Impact', icon: '👥', value: '0', change: '0%', trend: 'neutral', intensity: 0 },
  { name: 'Risk Level', icon: '⚠️', value: 'Low', change: '0%', trend: 'neutral', intensity: 0 }
])

const rippleEffects = reactive([])
const aiRecommendations = reactive([])

const canAnalyze = computed(() => {
  return selectedDecisionType.value && decisionAmount.value && decisionContext.value
})

// Executive Time Machine
const selectedPeriod = ref('')
const timeData = ref(null)

const timePeriods = [
  { id: 'past', label: '5 Years Ago' },
  { id: 'present', label: 'Present' },
  { id: 'future1', label: '1 Year Future' },
  { id: 'future5', label: '5 Years Future' },
  { id: 'future10', label: '10 Years Future' }
]

// War Room
const competitiveThreats = reactive([
  { id: 1, name: 'TechCorp', severity: 'high', position: { top: '30%', left: '70%' } },
  { id: 2, name: 'InnovateCo', severity: 'medium', position: { top: '60%', left: '40%' } },
  { id: 3, name: 'DisruptorInc', severity: 'critical', position: { top: '20%', left: '30%' } },
  { id: 4, name: 'StartupX', severity: 'low', position: { top: '80%', left: '60%' } }
])

const battleCommands = [
  { id: 1, name: 'Market Blitz', icon: '⚡', power: 'EXTREME', type: 'offensive' },
  { id: 2, name: 'Price War', icon: '💰', power: 'HIGH', type: 'aggressive' },
  { id: 3, name: 'Innovation Strike', icon: '🚀', power: 'CRITICAL', type: 'strategic' },
  { id: 4, name: 'Talent Raid', icon: '👑', power: 'MEDIUM', type: 'tactical' },
  { id: 5, name: 'Patent Fortress', icon: '🛡️', power: 'DEFENSIVE', type: 'protective' },
  { id: 6, name: 'Media Blitz', icon: '📺', power: 'VIRAL', type: 'influence' }
]

// Crystal Ball
const prophecy = ref(null)

const prophecies = [
  {
    prediction: 'A major technological breakthrough will emerge from your R&D division within 18 months, revolutionizing the industry and increasing market cap by 340%.',
    confidence: 87,
    timeline: '18 months',
    actions: ['Increase R&D budget by 25%', 'Hire 50 top-tier engineers', 'File 20+ patents', 'Prepare for IPO expansion']
  },
  {
    prediction: 'A strategic acquisition opportunity will present itself in Q2 2025. The target company will be valued at $2.8B but available for $1.9B due to market conditions.',
    confidence: 92,
    timeline: '6-8 months',
    actions: ['Prepare $2B war chest', 'Identify integration team', 'Conduct stealth due diligence', 'Secure board approval']
  },
  {
    prediction: 'Your main competitor will face a major scandal in 14 months, creating a 6-month window to capture 23% additional market share.',
    confidence: 78,
    timeline: '14 months',
    actions: ['Prepare rapid expansion plan', 'Stockpile inventory', 'Train sales force', 'Ready marketing blitz']
  }
]

// Mission Control
const selectedMission = ref('')
const isLaunching = ref(false)
const commandInput = ref('')

const missions = [
  { id: 1, name: 'Global Expansion Alpha' },
  { id: 2, name: 'Innovation Breakthrough' },
  { id: 3, name: 'Market Domination' },
  { id: 4, name: 'Competitive Strike' }
]

const activeMissions = reactive([
  { id: 1, name: 'Project Phoenix', icon: '🔥', progress: 87, eta: '2 days', status: 'active' },
  { id: 2, name: 'Operation Thunder', icon: '⚡', progress: 45, eta: '1 week', status: 'active' },
  { id: 3, name: 'Mission Quantum', icon: '🌌', progress: 92, eta: '6 hours', status: 'critical' }
])

const commandLogs = reactive([
  { timestamp: '14:32:15', message: 'Executive Command Center initialized', type: 'system' },
  { timestamp: '14:32:20', message: 'All systems operational', type: 'success' },
  { timestamp: '14:32:25', message: 'Awaiting executive commands...', type: 'info' }
])

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

// Decision Engine Methods
const getDecisionPlaceholder = () => {
  const type = decisionTypes.find(t => t.id === selectedDecisionType.value)
  return type ? type.placeholder : 'Enter amount...'
}

const getContextPlaceholder = () => {
  const type = decisionTypes.find(t => t.id === selectedDecisionType.value)
  return type ? type.context : 'Provide context...'
}

const analyzeDecision = () => {
  showImpactAnalysis.value = true
  
  // Simulate AI analysis with realistic data
  const amount = parseFloat(decisionAmount.value) || 0
  const type = selectedDecisionType.value
  
  // Update impact metrics based on decision type and amount
  updateImpactMetrics(type, amount)
  generateRippleEffects(type, amount)
  generateAIRecommendations(type, amount)
  
  // Add AI analysis message
  messages.push({
    id: Date.now(),
    type: 'ai',
    text: `Decision analysis complete. Analyzing ${type} with $${amount}M impact. Global ripple effects calculated across 47 markets. Strategic recommendations generated.`,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  })
}

const updateImpactMetrics = (type, amount) => {
  const multipliers = {
    acquisition: { revenue: 2.5, market: 1.8, employees: 1.2, risk: 1.5 },
    expansion: { revenue: 1.8, market: 2.2, employees: 1.5, risk: 1.3 },
    product: { revenue: 1.5, market: 1.6, employees: 1.1, risk: 1.2 },
    restructure: { revenue: 0.8, market: 0.9, employees: 2.5, risk: 1.8 },
    investment: { revenue: 1.2, market: 1.3, employees: 1.3, risk: 1.1 }
  }
  
  const mult = multipliers[type] || { revenue: 1, market: 1, employees: 1, risk: 1 }
  
  impactMetrics[0].value = `+$${(amount * mult.revenue).toFixed(1)}M`
  impactMetrics[0].change = `+${(mult.revenue * 10).toFixed(1)}%`
  impactMetrics[0].trend = mult.revenue > 1 ? 'positive' : 'negative'
  impactMetrics[0].intensity = Math.min(mult.revenue * 30, 100)
  
  impactMetrics[1].value = `${(mult.market * 5).toFixed(1)}%`
  impactMetrics[1].change = `+${(mult.market * 3).toFixed(1)}%`
  impactMetrics[1].trend = mult.market > 1 ? 'positive' : 'negative'
  impactMetrics[1].intensity = Math.min(mult.market * 35, 100)
  
  impactMetrics[2].value = `${Math.floor(amount * mult.employees * 100)}`
  impactMetrics[2].change = `${mult.employees > 1 ? '+' : ''}${((mult.employees - 1) * 100).toFixed(1)}%`
  impactMetrics[2].trend = mult.employees > 1 ? 'positive' : 'negative'
  impactMetrics[2].intensity = Math.min(mult.employees * 25, 100)
  
  const riskLevels = ['Low', 'Medium', 'High', 'Critical']
  const riskIndex = Math.min(Math.floor(mult.risk * 2), 3)
  impactMetrics[3].value = riskLevels[riskIndex]
  impactMetrics[3].change = `${mult.risk > 1 ? '+' : ''}${((mult.risk - 1) * 50).toFixed(1)}%`
  impactMetrics[3].trend = mult.risk > 1.2 ? 'negative' : 'positive'
  impactMetrics[3].intensity = Math.min(mult.risk * 40, 100)
}

const generateRippleEffects = (type, amount) => {
  const effects = {
    acquisition: [
      { id: 1, icon: '🏢', label: 'Competitors', value: '-15%', impact: 'negative', position: { top: '20%', left: '80%' } },
      { id: 2, icon: '💹', label: 'Stock Price', value: '+8%', impact: 'positive', position: { top: '60%', left: '85%' } },
      { id: 3, icon: '👥', label: 'Talent Pool', value: '+25%', impact: 'positive', position: { top: '80%', left: '20%' } },
      { id: 4, icon: '🌍', label: 'Market Cap', value: '+12%', impact: 'positive', position: { top: '30%', left: '15%' } }
    ],
    expansion: [
      { id: 1, icon: '🌍', label: 'Global Reach', value: '+30%', impact: 'positive', position: { top: '15%', left: '75%' } },
      { id: 2, icon: '💰', label: 'Revenue Streams', value: '+18%', impact: 'positive', position: { top: '70%', left: '80%' } },
      { id: 3, icon: '🔄', label: 'Supply Chain', value: '+22%', impact: 'positive', position: { top: '85%', left: '25%' } },
      { id: 4, icon: '🎨', label: 'Brand Value', value: '+14%', impact: 'positive', position: { top: '25%', left: '20%' } }
    ],
    product: [
      { id: 1, icon: '🚀', label: 'Innovation', value: '+40%', impact: 'positive', position: { top: '10%', left: '70%' } },
      { id: 2, icon: '📊', label: 'Market Share', value: '+12%', impact: 'positive', position: { top: '65%', left: '85%' } },
      { id: 3, icon: '🎯', label: 'Customer Base', value: '+28%', impact: 'positive', position: { top: '90%', left: '30%' } },
      { id: 4, icon: '⚙️', label: 'R&D Pipeline', value: '+35%', impact: 'positive', position: { top: '20%', left: '10%' } }
    ]
  }
  
  rippleEffects.splice(0, rippleEffects.length, ...(effects[type] || []))
}

const generateAIRecommendations = (type, amount) => {
  const recommendations = {
    acquisition: [
      {
        id: 1,
        priority: 'critical',
        title: 'Due Diligence Acceleration',
        description: 'Deploy AI-powered due diligence to reduce timeline by 40%',
        expectedImpact: '+$50M value creation'
      },
      {
        id: 2,
        priority: 'high',
        title: 'Integration Planning',
        description: 'Establish integration task force within 48 hours',
        expectedImpact: '60% faster integration'
      }
    ],
    expansion: [
      {
        id: 1,
        priority: 'critical',
        title: 'Market Entry Strategy',
        description: 'Leverage local partnerships for 3x faster market penetration',
        expectedImpact: '+$75M revenue acceleration'
      },
      {
        id: 2,
        priority: 'high',
        title: 'Regulatory Compliance',
        description: 'Engage regulatory experts in target markets immediately',
        expectedImpact: '80% risk reduction'
      }
    ],
    product: [
      {
        id: 1,
        priority: 'critical',
        title: 'Launch Optimization',
        description: 'AI-driven launch sequence for maximum market impact',
        expectedImpact: '+150% launch velocity'
      },
      {
        id: 2,
        priority: 'medium',
        title: 'Customer Feedback Loop',
        description: 'Implement real-time customer feedback system',
        expectedImpact: '40% faster iteration'
      }
    ]
  }
  
  aiRecommendations.splice(0, aiRecommendations.length, ...(recommendations[type] || []))
}

const executeRecommendation = (rec) => {
  alert(`Executing ${rec.title}...\n\n${rec.description}\n\nExpected Impact: ${rec.expectedImpact}\n\nGlobal teams have been notified and implementation is underway.`)
  
  messages.push({
    id: Date.now(),
    type: 'ai',
    text: `Recommendation "${rec.title}" executed successfully. Global implementation initiated across all relevant departments and regions.`,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  })
}

const showRippleDetails = () => {
  alert(`Decision Epicenter Analysis\n\nDecision Type: ${selectedDecisionType.value}\nInvestment: $${decisionAmount.value}M\n\nGlobal ripple effects are propagating across:\n• 47 international markets\n• 12 business units\n• 8,500+ employees\n• 450+ strategic partners\n\nReal-time monitoring active.`)
}

// Time Machine Methods
const travelToTime = (period) => {
  selectedPeriod.value = period.id
  
  const timeDataMap = {
    past: {
      period: '2019',
      subtitle: 'The Foundation Era',
      metrics: [
        { name: 'Revenue', value: '$500K', change: '+45%', trend: 'positive' },
        { name: 'Employees', value: '12', change: '+200%', trend: 'positive' },
        { name: 'Market Share', value: '0.1%', change: 'New', trend: 'neutral' }
      ],
      insights: [
        'Company founded with revolutionary AI vision',
        'First major client signed (Fortune 500)',
        'Core team assembled from top tech companies'
      ]
    },
    present: {
      period: '2024',
      subtitle: 'The Dominance Era',
      metrics: [
        { name: 'Revenue', value: '$2.4M', change: '+380%', trend: 'positive' },
        { name: 'Employees', value: '847', change: '+7000%', trend: 'positive' },
        { name: 'Market Share', value: '23.4%', change: '+2340%', trend: 'positive' }
      ],
      insights: [
        'Market leader in AI executive solutions',
        'Global presence in 47 countries',
        'IPO preparation underway'
      ]
    },
    future1: {
      period: '2025',
      subtitle: 'The Expansion Era',
      metrics: [
        { name: 'Revenue', value: '$8.7M', change: '+263%', trend: 'positive' },
        { name: 'Employees', value: '2,100', change: '+148%', trend: 'positive' },
        { name: 'Market Share', value: '34.8%', change: '+49%', trend: 'positive' }
      ],
      insights: [
        'Successful IPO raises $500M',
        'Major acquisition of European competitor',
        'Launch of quantum AI platform'
      ]
    },
    future5: {
      period: '2029',
      subtitle: 'The Empire Era',
      metrics: [
        { name: 'Revenue', value: '$2.8B', change: '+32,000%', trend: 'positive' },
        { name: 'Employees', value: '45,000', change: '+2,043%', trend: 'positive' },
        { name: 'Market Share', value: '67.2%', change: '+93%', trend: 'positive' }
      ],
      insights: [
        'Global AI empire spanning 120 countries',
        'First trillion-dollar AI company',
        'Revolutionary AGI breakthrough achieved'
      ]
    },
    future10: {
      period: '2034',
      subtitle: 'The Legacy Era',
      metrics: [
        { name: 'Revenue', value: '$47B', change: '+1,580%', trend: 'positive' },
        { name: 'Employees', value: '500K', change: '+1,011%', trend: 'positive' },
        { name: 'Market Share', value: '89.3%', change: '+33%', trend: 'positive' }
      ],
      insights: [
        'Most valuable company in human history',
        'AI has solved climate change and poverty',
        'Wisani Chauke named Person of the Decade'
      ]
    }
  }
  
  timeData.value = timeDataMap[period.id]
  
  messages.push({
    id: Date.now(),
    type: 'ai',
    text: `Time travel complete. You are now viewing ${timeData.value.period} - ${timeData.value.subtitle}. Quantum temporal analysis shows remarkable growth trajectory.`,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  })
}

// War Room Methods
const executeCommand = (command) => {
  const commandEffects = {
    1: 'Market Blitz launched! 47 markets simultaneously targeted. Estimated impact: +$340M revenue, +15% market share.',
    2: 'Price War initiated! Competitive pricing deployed across all products. Estimated impact: +28% customer acquisition.',
    3: 'Innovation Strike executed! 12 breakthrough products fast-tracked. Estimated impact: +67% innovation index.',
    4: 'Talent Raid successful! 150 top engineers recruited from competitors. Estimated impact: +45% R&D velocity.',
    5: 'Patent Fortress activated! 89 patents filed, legal moat strengthened. Estimated impact: +$2.1B IP value.',
    6: 'Media Blitz deployed! Global PR campaign launched. Estimated impact: +340% brand awareness.'
  }
  
  alert(`${command.name} - ${command.power} POWER\n\n${commandEffects[command.id]}\n\nGlobal command centers have been notified. Execution in progress.`)
  
  messages.push({
    id: Date.now(),
    type: 'ai',
    text: `War Room Command "${command.name}" executed with ${command.power} power. Strategic battle protocols activated across all global operations.`,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  })
}

// Crystal Ball Methods
const generateProphecy = () => {
  const randomProphecy = prophecies[Math.floor(Math.random() * prophecies.length)]
  prophecy.value = randomProphecy
  
  messages.push({
    id: Date.now(),
    type: 'ai',
    text: `The Crystal Ball reveals a prophecy with ${randomProphecy.confidence}% confidence. The future has been glimpsed, and strategic actions have been recommended.`,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  })
}

// Mission Control Methods
const initiateLaunch = () => {
  if (!selectedMission.value) return
  
  isLaunching.value = true
  const mission = missions.find(m => m.id == selectedMission.value)
  
  addCommandLog(`Mission "${mission.name}" launch initiated`, 'success')
  
  setTimeout(() => {
    isLaunching.value = false
    addCommandLog(`Mission "${mission.name}" successfully launched`, 'success')
    
    // Add to active missions
    activeMissions.push({
      id: Date.now(),
      name: mission.name,
      icon: '🚀',
      progress: 0,
      eta: '24 hours',
      status: 'active'
    })
    
    selectedMission.value = ''
  }, 3000)
}

const launchMission = () => {
  if (selectedMission.value) {
    initiateLaunch()
  } else {
    addCommandLog('Please select a mission first', 'warning')
  }
}

const executeMissionCommand = () => {
  if (!commandInput.value.trim()) return
  
  const command = commandInput.value.trim()
  addCommandLog(`> ${command}`, 'command')
  
  // Simulate command processing
  setTimeout(() => {
    const responses = [
      'Command executed successfully',
      'Global operations updated',
      'Strategic parameters adjusted',
      'Executive directive implemented',
      'Mission parameters optimized'
    ]
    
    const response = responses[Math.floor(Math.random() * responses.length)]
    addCommandLog(response, 'success')
  }, 500)
  
  commandInput.value = ''
}

const addCommandLog = (message, type) => {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
  commandLogs.push({ timestamp, message, type })
  
  // Keep only last 10 logs
  if (commandLogs.length > 10) {
    commandLogs.shift()
  }
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

// Executive Decision Engine Styles
.decision-engine-section {
  margin-bottom: 48px;
  
  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
    
    .engine-icon {
      font-size: 32px;
      animation: enginePulse 2s ease-in-out infinite;
    }
    
    .ai-status {
      background: var(--emerald-gradient);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      animation: statusPulse 3s ease-in-out infinite;
    }
  }
}

.decision-interface {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--luxe-gold), transparent);
    animation: scanLine 4s linear infinite;
  }
}

.decision-input-panel {
  margin-bottom: 32px;
  
  h3 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
    font-size: 20px;
    font-weight: 700;
  }
  
  .decision-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .decision-select {
      padding: 12px 16px;
      background: var(--theme-glass);
      border: 2px solid var(--theme-border);
      border-radius: 12px;
      color: var(--theme-text);
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: var(--luxe-gold);
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
      }
    }
    
    .decision-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: slideIn 0.5s ease-out;
      
      .decision-amount {
        padding: 12px 16px;
        background: var(--theme-glass);
        border: 2px solid var(--theme-border);
        border-radius: 12px;
        color: var(--theme-text);
        font-size: 16px;
        font-weight: 600;
        
        &:focus {
          outline: none;
          border-color: var(--luxe-gold);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }
      }
      
      .decision-context {
        padding: 16px;
        background: var(--theme-glass);
        border: 2px solid var(--theme-border);
        border-radius: 12px;
        color: var(--theme-text);
        font-size: 14px;
        min-height: 100px;
        resize: vertical;
        font-family: inherit;
        
        &:focus {
          outline: none;
          border-color: var(--luxe-gold);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }
      }
      
      .analyze-btn {
        padding: 16px 24px;
        background: var(--royal-gradient);
        border: none;
        border-radius: 12px;
        color: white;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        
        .btn-icon {
          font-size: 20px;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--gold-glow), 0 8px 24px rgba(212, 175, 55, 0.4);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

.impact-visualization {
  animation: fadeInUp 0.8s ease-out;
  
  h3 {
    margin: 0 0 24px 0;
    color: var(--theme-text);
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }
}

.impact-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  
  .impact-metric {
    background: var(--theme-glass);
    border: 1px solid var(--theme-border);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &.positive {
      border-color: var(--luxe-emerald);
      box-shadow: 0 0 20px rgba(15, 76, 58, 0.2);
    }
    
    &.negative {
      border-color: #ff4757;
      box-shadow: 0 0 20px rgba(255, 71, 87, 0.2);
    }
    
    .metric-icon {
      font-size: 32px;
      animation: metricPulse 3s ease-in-out infinite;
    }
    
    .metric-info {
      flex: 1;
      
      .metric-name {
        font-size: 12px;
        color: var(--theme-textSecondary);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      
      .metric-value {
        font-size: 24px;
        font-weight: 800;
        color: var(--theme-text);
        margin-bottom: 4px;
      }
      
      .metric-change {
        font-size: 12px;
        font-weight: 600;
        color: var(--luxe-gold);
      }
    }
    
    .metric-chart {
      width: 40px;
      height: 60px;
      position: relative;
      
      .chart-bar {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: var(--luxe-gold);
        border-radius: 4px;
        transition: height 1s ease-out;
        animation: barGrow 2s ease-out;
      }
    }
  }
}

.ripple-effect {
  margin-bottom: 32px;
  
  h4 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
  
  .ripple-map {
    position: relative;
    height: 300px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
    border-radius: 16px;
    overflow: hidden;
    
    .ripple-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      background: var(--royal-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
      }
      
      .decision-epicenter {
        color: white;
        font-weight: 700;
        font-size: 12px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .ripple-wave {
        position: absolute;
        width: 200px;
        height: 200px;
        border: 2px solid var(--luxe-gold);
        border-radius: 50%;
        animation: rippleExpand 3s ease-out infinite;
        opacity: 0;
      }
    }
    
    .ripple-node {
      position: absolute;
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
      min-width: 80px;
      animation: nodeAppear 1s ease-out;
      
      .node-icon {
        font-size: 20px;
        margin-bottom: 4px;
      }
      
      .node-label {
        font-size: 10px;
        color: var(--theme-textSecondary);
        margin-bottom: 4px;
      }
      
      .node-impact {
        font-size: 12px;
        font-weight: 700;
        
        &.positive {
          color: var(--luxe-emerald);
        }
        
        &.negative {
          color: #ff4757;
        }
      }
    }
  }
}

.ai-recommendations {
  h4 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
  
  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .recommendation-item {
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
      
      &.critical {
        border-left: 4px solid #ff4757;
      }
      
      &.high {
        border-left: 4px solid var(--luxe-amber);
      }
      
      &.medium {
        border-left: 4px solid var(--luxe-emerald);
      }
      
      .rec-priority {
        background: var(--royal-gradient);
        color: white;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      
      .rec-content {
        flex: 1;
        
        .rec-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--theme-text);
          margin-bottom: 4px;
        }
        
        .rec-description {
          font-size: 13px;
          color: var(--theme-textSecondary);
          margin-bottom: 8px;
          line-height: 1.4;
        }
        
        .rec-impact {
          font-size: 12px;
          color: var(--luxe-gold);
          font-weight: 600;
        }
      }
      
      .execute-btn {
        padding: 8px 16px;
        background: var(--emerald-gradient);
        border: none;
        border-radius: 8px;
        color: white;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--emerald-glow);
        }
      }
    }
  }
}

// Decision Engine Animations
@keyframes enginePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes scanLine {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes sparkle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes metricPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes barGrow {
  from { height: 0; }
  to { height: var(--final-height, 50%); }
}

@keyframes rippleExpand {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes nodeAppear {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

// Time Machine Styles
.time-machine-section {
  margin-bottom: 48px;
  
  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
    
    .time-icon {
      font-size: 32px;
      animation: timeRotate 4s linear infinite;
    }
    
    .quantum-status {
      background: var(--sapphire-gradient);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      animation: quantumFlicker 2s ease-in-out infinite;
    }
  }
}

.time-machine-interface {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 32px;
}

.timeline-controls {
  display: flex;
  gap: 12px;
  margin: 16px 0 32px 0;
  flex-wrap: wrap;
  justify-content: center;
  
  .time-btn {
    padding: 12px 20px;
    background: var(--theme-glass);
    border: 2px solid var(--theme-border);
    border-radius: 12px;
    color: var(--theme-text);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--luxe-gold);
      transform: translateY(-2px);
    }
    
    &.active {
      background: var(--royal-gradient);
      color: white;
      border-color: var(--luxe-gold);
      box-shadow: var(--gold-glow);
    }
  }
}

.time-portal {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 32px;
  
  .portal-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid var(--luxe-gold);
    border-radius: 50%;
    animation: portalSpin 6s linear infinite;
    opacity: 0.6;
    
    &:nth-child(2) {
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
      animation-direction: reverse;
      animation-duration: 4s;
    }
    
    &:nth-child(3) {
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      animation-duration: 8s;
    }
  }
  
  .portal-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    
    .time-display {
      font-size: 24px;
      font-weight: 800;
      color: var(--luxe-gold);
      margin-bottom: 4px;
    }
    
    .time-subtitle {
      font-size: 12px;
      color: var(--theme-textSecondary);
    }
  }
}

.time-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  .time-metric {
    background: var(--theme-glass);
    border: 1px solid var(--theme-border);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    
    .metric-label {
      font-size: 12px;
      color: var(--theme-textSecondary);
      margin-bottom: 8px;
    }
    
    .metric-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--theme-text);
      margin-bottom: 4px;
    }
    
    .metric-trend {
      font-size: 12px;
      font-weight: 600;
      
      &.positive {
        color: var(--luxe-emerald);
      }
    }
  }
}

.time-insights {
  h4 {
    margin: 0 0 16px 0;
    color: var(--theme-text);
    text-align: center;
  }
  
  .time-insight {
    padding: 12px 16px;
    margin-bottom: 8px;
    background: var(--theme-glass);
    border-radius: 8px;
    font-size: 14px;
    color: var(--theme-text);
  }
}

// War Room Styles
.war-room-section {
  margin-bottom: 48px;
  
  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
    
    .war-icon {
      font-size: 32px;
      animation: warPulse 3s ease-in-out infinite;
    }
    
    .battle-status {
      background: linear-gradient(135deg, #ff4757, #ff6b7a);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      animation: battleReady 2s ease-in-out infinite;
    }
  }
}

.war-room-interface {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.threat-radar {
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
  
  h3 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
    text-align: center;
  }
  
  .radar-display {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    border: 2px solid var(--luxe-gold);
    
    .radar-sweep {
      position: absolute;
      top: 0;
      left: 50%;
      width: 2px;
      height: 50%;
      background: linear-gradient(to bottom, var(--luxe-gold), transparent);
      transform-origin: 0 100%;
      transform: translateX(-50%);
      animation: radarSweep 3s linear infinite;
    }
    
    .radar-grid {
      position: absolute;
      width: 100%;
      height: 100%;
      
      .grid-line {
        position: absolute;
        background: rgba(212, 175, 55, 0.3);
        
        &.horizontal {
          width: 100%;
          height: 1px;
          
          &:nth-child(1) { top: 25%; }
          &:nth-child(2) { top: 50%; }
          &:nth-child(3) { top: 75%; }
        }
        
        &.vertical {
          height: 100%;
          width: 1px;
          
          &:nth-child(1) { left: 25%; }
          &:nth-child(2) { left: 50%; }
          &:nth-child(3) { left: 75%; }
        }
      }
    }
    
    .threat-blip {
      position: absolute;
      transform: translate(-50%, -50%);
      
      .blip-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        animation: blipPulse 2s ease-in-out infinite;
        
        .threat-blip.critical & {
          background: #ff4757;
          box-shadow: 0 0 10px #ff4757;
        }
        
        .threat-blip.high & {
          background: var(--luxe-amber);
          box-shadow: 0 0 8px var(--luxe-amber);
        }
        
        .threat-blip.medium & {
          background: var(--luxe-gold);
          box-shadow: 0 0 6px var(--luxe-gold);
        }
        
        .threat-blip.low & {
          background: var(--luxe-emerald);
          box-shadow: 0 0 4px var(--luxe-emerald);
        }
      }
      
      .blip-label {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        color: var(--theme-text);
        white-space: nowrap;
      }
    }
  }
}

.battle-commands {
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
  
  h3 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
    text-align: center;
  }
  
  .command-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .command-btn {
      padding: 16px 12px;
      background: var(--theme-glass);
      border: 2px solid var(--theme-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      
      &:hover {
        transform: translateY(-2px);
        border-color: var(--luxe-gold);
      }
      
      &.offensive {
        border-left-color: #ff4757;
      }
      
      &.strategic {
        border-left-color: var(--luxe-sapphire);
      }
      
      &.tactical {
        border-left-color: var(--luxe-amber);
      }
      
      .command-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
      
      .command-name {
        font-size: 12px;
        font-weight: 600;
        color: var(--theme-text);
        margin-bottom: 4px;
      }
      
      .command-power {
        font-size: 10px;
        color: var(--luxe-gold);
        font-weight: 700;
      }
    }
  }
}

// Crystal Ball Styles
.crystal-ball-section {
  margin-bottom: 48px;
  
  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
    
    .crystal-icon {
      font-size: 32px;
      animation: crystalGlow 4s ease-in-out infinite;
    }
    
    .prophecy-status {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      animation: prophecyPulse 3s ease-in-out infinite;
    }
  }
}

.crystal-interface {
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
}

.crystal-ball {
  display: inline-block;
  margin-bottom: 32px;
  cursor: pointer;
  
  .crystal-sphere {
    position: relative;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.2));
    border-radius: 50%;
    border: 3px solid var(--luxe-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: var(--gold-glow), 0 0 40px rgba(138, 43, 226, 0.4);
    }
    
    .crystal-glow {
      position: absolute;
      width: 120%;
      height: 120%;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      animation: crystalBreath 4s ease-in-out infinite;
    }
    
    .crystal-swirl {
      position: absolute;
      width: 80%;
      height: 80%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: crystalSwirl 8s linear infinite;
    }
    
    .crystal-center {
      font-size: 18px;
      font-weight: 800;
      color: var(--luxe-gold);
      text-shadow: 0 0 10px var(--luxe-gold);
      z-index: 1;
    }
  }
}

.prophecy-display {
  animation: prophecyReveal 1s ease-out;
  
  h3 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
    font-size: 20px;
  }
  
  .prophecy-content {
    background: var(--theme-glass);
    border: 1px solid var(--luxe-gold);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    
    .prophecy-text {
      font-size: 16px;
      color: var(--theme-text);
      line-height: 1.6;
      margin-bottom: 16px;
      font-style: italic;
    }
    
    .prophecy-confidence {
      font-size: 14px;
      color: var(--luxe-gold);
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .prophecy-timeline {
      font-size: 14px;
      color: var(--luxe-emerald);
      font-weight: 600;
    }
  }
  
  .prophecy-actions {
    h4 {
      margin: 0 0 16px 0;
      color: var(--theme-text);
    }
    
    .prophecy-action {
      padding: 12px 16px;
      margin-bottom: 8px;
      background: var(--theme-glass);
      border-radius: 8px;
      font-size: 14px;
      color: var(--theme-text);
      text-align: left;
    }
  }
}

// Additional Animations
@keyframes timeRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes quantumFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes portalSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes warPulse {
  0%, 100% { transform: scale(1); color: #ff4757; }
  50% { transform: scale(1.1); color: #ff6b7a; }
}

@keyframes battleReady {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes radarSweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes blipPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

@keyframes crystalGlow {
  0%, 100% { text-shadow: 0 0 5px currentColor; }
  50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
}

@keyframes prophecyPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes crystalBreath {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
}

@keyframes crystalSwirl {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes prophecyReveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

// Mission Control Styles
.mission-control-section {
  margin-bottom: 48px;
  
  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
    
    .mission-icon {
      font-size: 32px;
      animation: rocketPulse 3s ease-in-out infinite;
    }
    
    .launch-status {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      animation: launchReady 2s ease-in-out infinite;
    }
  }
}

.mission-interface {
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 32px;
}

.mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.launch-pad {
  text-align: center;
  
  h3 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
  }
  
  .rocket-display {
    position: relative;
    height: 200px;
    margin-bottom: 24px;
    
    .rocket {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateX(-50%) translateY(-5px);
      }
      
      .rocket-body {
        width: 30px;
        height: 80px;
        background: linear-gradient(to bottom, var(--luxe-gold), var(--luxe-amber));
        border-radius: 15px 15px 5px 5px;
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 20px solid var(--luxe-gold);
        }
      }
      
      .rocket-flames {
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        
        .flame {
          width: 8px;
          height: 20px;
          background: linear-gradient(to bottom, #ff4757, #ffa502);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          display: inline-block;
          margin: 0 2px;
          animation: flameFlicker 0.3s ease-in-out infinite alternate;
          
          &:nth-child(2) {
            animation-delay: 0.1s;
          }
          
          &:nth-child(3) {
            animation-delay: 0.2s;
          }
        }
      }
    }
    
    .launch-platform {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 20px;
      background: var(--theme-border);
      border-radius: 10px;
    }
  }
  
  .launch-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .mission-select {
      padding: 12px 16px;
      background: var(--theme-glass);
      border: 2px solid var(--theme-border);
      border-radius: 12px;
      color: var(--theme-text);
      font-weight: 600;
      
      &:focus {
        outline: none;
        border-color: var(--luxe-gold);
      }
    }
    
    .launch-btn {
      padding: 12px 20px;
      background: var(--emerald-gradient);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: var(--emerald-glow);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.mission-status {
  h3 {
    margin: 0 0 20px 0;
    color: var(--theme-text);
  }
  
  .missions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .mission-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 12px;
      
      &.critical {
        border-left: 4px solid #ff4757;
      }
      
      &.active {
        border-left: 4px solid var(--luxe-emerald);
      }
      
      .mission-icon {
        font-size: 24px;
      }
      
      .mission-info {
        flex: 1;
        
        .mission-name {
          font-weight: 600;
          color: var(--theme-text);
          margin-bottom: 8px;
        }
        
        .mission-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          
          .progress-bar {
            flex: 1;
            height: 6px;
            background: var(--theme-border);
            border-radius: 3px;
            overflow: hidden;
            
            .progress-fill {
              height: 100%;
              background: var(--luxe-emerald);
              transition: width 0.3s ease;
            }
          }
          
          .progress-text {
            font-size: 12px;
            color: var(--theme-textSecondary);
            min-width: 35px;
          }
        }
        
        .mission-eta {
          font-size: 11px;
          color: var(--luxe-gold);
        }
      }
      
      .mission-status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &.active {
          background: var(--luxe-emerald);
          box-shadow: 0 0 8px var(--luxe-emerald);
          animation: statusBlink 2s ease-in-out infinite;
        }
        
        &.critical {
          background: #ff4757;
          box-shadow: 0 0 8px #ff4757;
          animation: statusBlink 1s ease-in-out infinite;
        }
      }
    }
  }
}

.command-console {
  h3 {
    margin: 0 0 16px 0;
    color: var(--theme-text);
  }
  
  .console-display {
    background: var(--luxe-obsidian);
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    padding: 16px;
    height: 200px;
    overflow-y: auto;
    font-family: 'Courier New', monospace;
    margin-bottom: 16px;
    
    .console-line {
      margin-bottom: 4px;
      font-size: 12px;
      
      .timestamp {
        color: var(--luxe-gold);
        margin-right: 8px;
      }
      
      .message {
        color: var(--theme-text);
      }
      
      &.system .message {
        color: var(--luxe-sapphire);
      }
      
      &.success .message {
        color: var(--luxe-emerald);
      }
      
      &.warning .message {
        color: var(--luxe-amber);
      }
      
      &.command .message {
        color: var(--luxe-gold);
      }
    }
  }
  
  .console-input {
    display: flex;
    gap: 12px;
    
    .command-input {
      flex: 1;
      padding: 12px 16px;
      background: var(--theme-glass);
      border: 2px solid var(--theme-border);
      border-radius: 8px;
      color: var(--theme-text);
      font-family: 'Courier New', monospace;
      
      &:focus {
        outline: none;
        border-color: var(--luxe-gold);
      }
    }
    
    .execute-btn {
      padding: 12px 20px;
      background: var(--royal-gradient);
      border: none;
      border-radius: 8px;
      color: white;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--gold-glow);
      }
    }
  }
}

// Mission Control Animations
@keyframes rocketPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes launchReady {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes flameFlicker {
  0% { transform: scaleY(1); }
  100% { transform: scaleY(1.3); }
}

@keyframes statusBlink {
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
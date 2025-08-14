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
          <button @click="sendToEmail" class="email-btn">
            📧 Email Report
          </button>
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
          <button @click="toggleTheme" class="theme-toggle">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Executive Profile & Summary -->
        <div class="executive-summary">
          <div class="summary-header">

            <h1 class="executive-title">Executive Command Center</h1>
            <div class="summary-meta">
              <div class="meta-item">
                <span>🛡️ Quantum Encrypted</span>
              </div>
              <div class="meta-item">
                <span>🧠 AI Intelligence Active</span>
              </div>
              <div class="meta-item">
                <span>🌍 Global Operations Live</span>
              </div>
              <div class="meta-item">
                <span>⏰ Session: {{ sessionTime }}</span>
              </div>
            </div>
          </div>
          
          <div class="executive-controls">
            <button @click="generateReport" class="btn-primary">
              📊 Board Presentation
            </button>
            <button @click="openAnalytics" class="btn-secondary">
              📈 Analytics Suite
            </button>
            <button @click="openSecurityCenter" class="btn-tertiary">
              🛡️ Security Center
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div v-if="isLoading">
            <div v-for="i in 4" :key="i" class="skeleton-loader card"></div>
          </div>
          <div v-else>
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
        </div>

        <!-- Live Stock Ticker -->
        <div class="stock-ticker-section">
          <div class="section-title">Market Watch</div>
          <div class="ticker-container">
            <div class="ticker-content" :style="{ transform: `translateX(${tickerPosition}px)` }">
              <div v-for="(stock, index) in [...stocks, ...stocks]" 
                   :key="`${stock.symbol}-${index}`"
                   class="stock-item"
                   @click="selectStock(stock)">
                <span class="symbol">{{ stock.symbol }}</span>
                <span class="price">${{ stock.price.toFixed(2) }}</span>
                <span class="change" :class="stock.change >= 0 ? 'positive' : 'negative'">
                  {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Executive Assistant -->
        <div class="ai-assistant-section">
          <div class="section-title">ARIA - AI Executive Assistant</div>
          <div class="ai-container">
            <div class="chat-messages">
              <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
                <div class="message-avatar" v-if="message.type === 'ai'">
                  <div class="ai-avatar">
                    <div class="ai-core"></div>
                  </div>
                </div>
                <div class="message-content">
                  <div class="message-text">{{ message.text }}</div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>
            </div>
            
            <div class="chat-input">
              <input 
                v-model="currentMessage" 
                @keyup.enter="sendMessage"
                placeholder="Ask ARIA about your business..."
                class="message-input"
              />
              <button @click="sendMessage" class="send-btn" :disabled="!currentMessage.trim()">
                📤
              </button>
            </div>
            
            <div class="quick-actions">
              <button v-for="action in quickActions" :key="action" 
                      @click="sendQuickMessage(action)" 
                      class="quick-btn">
                {{ action }}
              </button>
            </div>
          </div>
        </div>

        <!-- Holographic Data Visualization -->
        <div class="hologram-section">
          <div class="section-title">
            Holographic Analytics
            <span class="data-status">🟢 Live Data</span>
          </div>
          <div class="hologram-container" @mousemove="onHologramMouseMove" @touchmove="onHologramTouchMove">
            <div v-if="isLoading" class="skeleton-loader chart"></div>
            <div v-else>
                <div class="hologram-stage" :style="hologramStyle">
                  <div v-for="(bar, index) in dataPoints" :key="index" 
                       class="data-bar" 
                       :style="getBarStyle(bar, index)"
                       @click="selectDataPoint(bar)"
                       @touchstart="selectDataPoint(bar)">
                    <div class="bar-glow"></div>
                    <div class="bar-value">{{ bar.value }}</div>
                  </div>
                  
                  <div v-for="(particle, index) in particles" :key="`particle-${index}`"
                       class="floating-particle"
                       :style="getParticleStyle(particle, index)">
                  </div>
                </div>
                
                <div class="hologram-controls">
                  <button v-for="dataset in datasets" :key="dataset" 
                          @click="switchDataset(dataset)"
                          class="dataset-btn"
                          :class="{ active: currentDataset === dataset }">
                    {{ dataset }}
                  </button>
                </div>
            </div>
          </div>
        </div>

        <!-- Interactive Globe -->
        <div class="globe-section">
          <div class="section-title">Global Operations</div>
          <div class="globe-container">
            <div class="globe">
              <div v-for="office in offices" :key="office.id" 
                   class="office-pin" 
                   :style="{ left: office.x + '%', top: office.y + '%' }"
                   @click="showOfficeDetails(office)">
                <div class="pin-dot" :class="office.tier"></div>
                <div class="pin-label">{{ office.city }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Network Topology -->
        <div class="network-section">
          <div class="section-title">Network Infrastructure</div>
          <div class="network-container">
            <svg class="network-svg" viewBox="0 0 800 400">
              <!-- Connection Lines -->
              <g class="connections">
                <path v-for="connection in networkConnections" 
                      :key="connection.id"
                      :d="connection.path"
                      :stroke="getConnectionColor(connection.status)"
                      :stroke-width="getConnectionWidth(connection.bandwidth)"
                      fill="none"
                      class="connection-line"
                      :class="connection.status">
                  <animate attributeName="stroke-dasharray" 
                           values="0,10;10,0;0,10" 
                           dur="2s" 
                           repeatCount="indefinite" 
                           v-if="connection.animated" />
                </path>
              </g>
              
              <!-- Network Nodes -->
              <g class="nodes">
                <g v-for="node in networkNodes" 
                   :key="node.id"
                   :transform="`translate(${node.x}, ${node.y})`"
                   @click="selectNetworkNode(node)"
                   class="network-node"
                   :class="node.type">
                  
                  <!-- Node Glow -->
                  <circle :r="node.size + 8" 
                          :fill="getNodeGlow(node.type)"
                          opacity="0.3"
                          class="node-glow" />
                  
                  <!-- Main Node -->
                  <circle :r="node.size" 
                          :fill="getNodeColor(node.type)"
                          stroke="white"
                          stroke-width="2"
                          class="node-circle" />
                  
                  <!-- Node Icon -->
                  <text font-size="16"
                        text-anchor="middle"
                        dominant-baseline="central"
                        fill="white"
                        class="node-icon">
                    {{ getNodeIcon(node.type) }}
                  </text>
                  
                  <!-- Status Indicator -->
                  <circle :cx="node.size * 0.7"
                          :cy="-node.size * 0.7"
                          r="4"
                          :fill="getStatusColor(node.status)"
                          class="status-indicator" />
                </g>
              </g>
            </svg>
            
            <div class="network-stats">
              <div class="stat-item">
                <div class="stat-value">{{ networkStats.totalNodes }}</div>
                <div class="stat-label">Total Nodes</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ networkStats.activeConnections }}</div>
                <div class="stat-label">Active Connections</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ networkStats.throughput }}</div>
                <div class="stat-label">Throughput</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ networkStats.latency }}</div>
                <div class="stat-label">Avg Latency</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Voice Command Center -->
        <div class="voice-section">
          <div class="section-title">AI Voice Assistant</div>
          <div class="voice-container">
            <div class="voice-visualizer">
              <div class="waveform">
                <div v-for="i in 12" :key="i"
                     class="wave-bar"
                     :style="getWaveBarStyle(i)"></div>
              </div>
              
              <div v-if="isListening" class="listening-indicator">
                <div class="pulse-ring"></div>
                <div class="mic-icon">🎤</div>
              </div>
            </div>
            
            <div class="voice-controls">
              <button @click="toggleListening" 
                      class="voice-btn"
                      :class="{ active: isListening }">
                {{ isListening ? 'Stop Listening' : 'Start Voice Command' }}
              </button>
              
              <div class="voice-status">
                {{ isListening ? 'Listening...' : 'Ready for voice commands' }}
              </div>
            </div>
            
            <div class="voice-commands">
              <div class="command-title">Quick Voice Commands:</div>
              <div class="command-list">
                <button v-for="cmd in voiceCommands" :key="cmd"
                        @click="executeVoiceCommand(cmd)"
                        class="voice-cmd-btn">
                  {{ cmd }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Analytics Dashboard -->
        <div class="analytics-section">
          <div class="section-title">Advanced Analytics Suite</div>
          <div class="analytics-grid">
            <div class="analytics-card">
              <div class="card-header">
                <h3>📊 Revenue Forecasting</h3>
                <button @click="refreshAnalytics('revenue')" class="refresh-btn">🔄</button>
              </div>
              <div class="forecast-chart">
                <div class="chart-bars">
                  <div v-for="(month, index) in forecastData" :key="index" 
                       class="forecast-bar"
                       :style="{ height: month.height + '%', animationDelay: index * 0.1 + 's' }">
                    <div class="bar-value">${{ month.value }}M</div>
                    <div class="bar-label">{{ month.month }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card">
              <div class="card-header">
                <h3>🎯 Performance Metrics</h3>
                <button @click="refreshAnalytics('performance')" class="refresh-btn">🔄</button>
              </div>
              <div class="metrics-grid">
                <div v-for="metric in performanceMetrics" :key="metric.name" class="metric-item">
                  <div class="metric-circle" :style="{ background: `conic-gradient(var(--luxe-gold) ${metric.value}%, var(--luxe-obsidian) 0%)` }">
                    <div class="metric-inner">
                      <span class="metric-value">{{ metric.value }}%</span>
                    </div>
                  </div>
                  <div class="metric-name">{{ metric.name }}</div>
                </div>
              </div>
            </div>

            <div class="analytics-card">
              <div class="card-header">
                <h3>🌍 Global Insights</h3>
                <button @click="refreshAnalytics('global')" class="refresh-btn">🔄</button>
              </div>
              <div class="global-stats">
                <div v-for="region in globalStats" :key="region.name" class="region-stat">
                  <div class="region-flag">{{ region.flag }}</div>
                  <div class="region-info">
                    <div class="region-name">{{ region.name }}</div>
                    <div class="region-growth" :class="region.trend">
                      {{ region.growth }}% {{ region.trend === 'up' ? '↗️' : '↘️' }}
                    </div>
                  </div>
                  <div class="region-revenue">${{ region.revenue }}M</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-time Monitoring -->
        <div class="monitoring-section">
          <div class="section-title">Real-time System Monitoring</div>
          <div class="monitoring-grid">
            <div class="monitor-card">
              <div class="monitor-header">
                <h3>🖥️ System Health</h3>
                <div class="status-indicator" :class="systemHealth.status"></div>
              </div>
              <div class="health-metrics">
                <div v-for="metric in systemHealth.metrics" :key="metric.name" class="health-item">
                  <div class="health-label">{{ metric.name }}</div>
                  <div class="health-bar">
                    <div class="health-fill" :style="{ width: metric.value + '%', background: getHealthColor(metric.value) }"></div>
                  </div>
                  <div class="health-value">{{ metric.value }}%</div>
                </div>
              </div>
            </div>

            <div class="monitor-card">
              <div class="monitor-header">
                <h3>📡 API Performance</h3>
                <div class="api-status">{{ apiMetrics.totalRequests }} req/min</div>
              </div>
              <div class="api-chart">
                <div class="response-times">
                  <div v-for="(time, index) in apiMetrics.responseTimes" :key="index"
                       class="response-bar"
                       :style="{ height: time + 'px', animationDelay: index * 0.05 + 's' }">
                  </div>
                </div>
              </div>
            </div>

            <div class="monitor-card">
              <div class="monitor-header">
                <h3>🔒 Security Dashboard</h3>
                <div class="security-level" :class="securityStatus.level">{{ securityStatus.level.toUpperCase() }}</div>
              </div>
              <div class="security-alerts">
                <div v-for="alert in securityStatus.alerts" :key="alert.id" class="alert-item" :class="alert.severity">
                  <div class="alert-icon">{{ alert.icon }}</div>
                  <div class="alert-text">{{ alert.message }}</div>
                  <div class="alert-time">{{ alert.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Executive Reports -->
        <div class="reports-section">
          <div class="section-title">Executive Reports & Insights</div>
          <div class="reports-grid">
            <div v-for="report in executiveReports" :key="report.id" 
                 class="report-card"
                 @click="generateReport(report)">
              <div class="report-icon">{{ report.icon }}</div>
              <div class="report-info">
                <h3>{{ report.title }}</h3>
                <p>{{ report.description }}</p>
                <div class="report-meta">
                  <span class="report-type">{{ report.type }}</span>
                  <span class="report-time">{{ report.lastGenerated }}</span>
                </div>
              </div>
              <div class="report-action">
                <button class="generate-btn">Generate</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantum Intelligence Engine -->
        <div class="quantum-section">
          <div class="section-title">🔮 Quantum Intelligence Engine</div>
          <div class="quantum-grid">
            <div class="quantum-card">
              <div class="quantum-core">
                <div class="quantum-particles">
                  <div v-for="i in 8" :key="i" class="particle" :style="getParticleAnimation(i)"></div>
                </div>
                <div class="quantum-center">
                  <div class="quantum-pulse"></div>
                  <div class="quantum-text">AI NEXUS</div>
                </div>
              </div>
              <div class="quantum-stats">
                <div class="quantum-stat">
                  <div class="stat-value">{{ quantumMetrics.processingPower }}</div>
                  <div class="stat-label">Quantum Processing</div>
                </div>
                <div class="quantum-stat">
                  <div class="stat-value">{{ quantumMetrics.predictions }}</div>
                  <div class="stat-label">Active Predictions</div>
                </div>
                <div class="quantum-stat">
                  <div class="stat-value">{{ quantumMetrics.accuracy }}%</div>
                  <div class="stat-label">Accuracy Rate</div>
                </div>
              </div>
            </div>

            <div class="neural-network">
              <div class="network-title">Neural Pathways</div>
              <div class="neural-grid">
                <div v-for="(node, index) in neuralNodes" :key="index" 
                     class="neural-node"
                     :class="node.active ? 'active' : ''"
                     :style="{ animationDelay: index * 0.1 + 's' }">
                  <div class="node-core"></div>
                  <div class="node-connections">
                    <div v-for="j in node.connections" :key="j" class="connection-line"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Biometric Security Center -->
        <div class="biometric-section">
          <div class="section-title">🔬 Biometric Security Center</div>
          <div class="biometric-grid">
            <div class="biometric-scanner">
              <div class="scanner-display">
                <div class="fingerprint-scanner">
                  <div class="fingerprint-pattern">
                    <div v-for="i in 12" :key="i" class="print-line" :style="{ animationDelay: i * 0.1 + 's' }"></div>
                  </div>
                  <div class="scan-beam"></div>
                </div>
                <div class="scan-status">{{ biometricStatus.status }}</div>
              </div>
              <div class="biometric-data">
                <div class="bio-item">
                  <span class="bio-label">Identity Confidence:</span>
                  <span class="bio-value">{{ biometricStatus.confidence }}%</span>
                </div>
                <div class="bio-item">
                  <span class="bio-label">Last Scan:</span>
                  <span class="bio-value">{{ biometricStatus.lastScan }}</span>
                </div>
                <div class="bio-item">
                  <span class="bio-label">Access Level:</span>
                  <span class="bio-value">{{ biometricStatus.accessLevel }}</span>
                </div>
              </div>
            </div>

            <div class="security-logs">
              <div class="logs-header">
                <h3>Security Access Logs</h3>
                <button @click="exportLogs" class="export-btn">📤 Export</button>
              </div>
              <div class="logs-list">
                <div v-for="log in securityLogs" :key="log.id" class="log-entry" :class="log.type">
                  <div class="log-icon">{{ log.icon }}</div>
                  <div class="log-details">
                    <div class="log-action">{{ log.action }}</div>
                    <div class="log-meta">
                      <span class="log-user">{{ log.user }}</span>
                      <span class="log-time">{{ log.timestamp }}</span>
                      <span class="log-location">{{ log.location }}</span>
                    </div>
                  </div>
                  <div class="log-status" :class="log.status">{{ log.status }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Elite Modal System -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <button @click="closeModal" class="modal-close">✕</button>
        
        <!-- Profile Modal -->
        <div v-if="modalType === 'profile'" class="profile-modal">
          <div class="modal-header">
            <div class="profile-hero">
              <img :src="currentExecutive.avatar" :alt="modalData.name" class="hero-avatar" />
              <div class="hero-info">
                <h2>{{ modalData.name }}</h2>
                <p>{{ modalData.title }}</p>
                <div class="clearance-display">{{ modalData.clearance }}</div>
              </div>
            </div>
          </div>
          <div class="modal-body">
            <div class="profile-stats">
              <div class="stat-card">
                <div class="stat-value">{{ modalData.metrics.decisionsToday }}</div>
                <div class="stat-label">Decisions Today</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ modalData.metrics.reportsGenerated }}</div>
                <div class="stat-label">Reports Generated</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ modalData.securityScore }}%</div>
                <div class="stat-label">Security Score</div>
              </div>
            </div>
            <div class="achievements">
              <h3>Achievements</h3>
              <div class="achievement-list">
                <span v-for="achievement in modalData.achievements" :key="achievement" class="achievement-badge">
                  🏆 {{ achievement }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Report Modal -->
        <div v-if="modalType === 'report'" class="report-modal">
          <div class="modal-header">
            <h2>📊 {{ modalData.title }}</h2>
            <div class="report-meta">{{ modalData.type }} • {{ modalData.pages }} pages</div>
          </div>
          <div class="modal-body">
            <div class="report-preview">
              <div class="preview-stats">
                <div class="preview-stat">
                  <span class="stat-number">{{ modalData.insights }}</span>
                  <span class="stat-text">AI Insights</span>
                </div>
                <div class="preview-stat">
                  <span class="stat-number">{{ modalData.charts }}</span>
                  <span class="stat-text">Interactive Charts</span>
                </div>
                <div class="preview-stat">
                  <span class="stat-number">{{ modalData.recommendations }}</span>
                  <span class="stat-text">Strategic Recommendations</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="action-btn primary">📧 Email Report</button>
                <button class="action-btn secondary">📎 Download PDF</button>
                <button class="action-btn tertiary">🔗 Share Link</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- KPI Modal -->
        <div v-if="modalType === 'kpi'" class="kpi-modal">
          <div class="modal-header">
            <h2>{{ modalData.title }}</h2>
            <div class="kpi-trend">{{ modalData.trend }}</div>
          </div>
          <div class="modal-body">
            <div class="kpi-overview">
              <div class="kpi-main-value">{{ modalData.value }}</div>
              <div class="kpi-change">{{ modalData.change }}</div>
            </div>
            <div class="kpi-breakdown">
              <h3>Breakdown Analysis</h3>
              <div v-for="(item, key) in modalData.breakdown" :key="key" class="breakdown-item">
                <span class="breakdown-label">{{ key }}</span>
                <span class="breakdown-value">{{ item.value }}</span>
                <span class="breakdown-change">{{ item.change }}</span>
              </div>
            </div>
            <div class="kpi-insights">
              <h3>Key Insights</h3>
              <ul>
                <li v-for="insight in modalData.insights" :key="insight">{{ insight }}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Security Modal -->
        <div v-if="modalType === 'security'" class="security-modal">
          <div class="modal-header">
            <h2>🔒 {{ modalData.title }}</h2>
            <div class="threat-level" :class="modalData.threatLevel.toLowerCase()">{{ modalData.threatLevel }}</div>
          </div>
          <div class="modal-body">
            <div class="security-overview">
              <div class="security-stat">
                <div class="stat-value">{{ modalData.securityScore }}%</div>
                <div class="stat-label">Security Score</div>
              </div>
              <div class="security-stat">
                <div class="stat-value">{{ modalData.blockedAttempts.toLocaleString() }}</div>
                <div class="stat-label">Threats Blocked</div>
              </div>
              <div class="security-stat">
                <div class="stat-value">{{ modalData.activeThreats }}</div>
                <div class="stat-label">Active Threats</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Analytics Modal -->
        <div v-if="modalType === 'analytics'" class="analytics-modal">
          <div class="modal-header">
            <h2>📈 {{ modalData.title }}</h2>
            <div class="analytics-status">🟢 {{ modalData.insights }} Active Insights</div>
          </div>
          <div class="modal-body">
            <div class="analytics-overview">
              <div class="analytics-stat">
                <div class="stat-value">{{ modalData.insights }}</div>
                <div class="stat-label">AI Insights</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Voice Result Modal -->
        <div v-if="modalType === 'voiceResult'" class="voice-result-modal">
          <div class="modal-header">
            <h2>🎤 Voice Command Executed</h2>
            <div class="confidence-badge">{{ modalData.confidence }} Confidence</div>
          </div>
          <div class="modal-body">
            <div class="command-result">
              <div class="result-text">{{ modalData.result }}</div>
            </div>
            <div class="actions-taken">
              <h3>Actions Completed</h3>
              <div v-for="action in modalData.actions" :key="action" class="action-item">✓ {{ action }}</div>
            </div>
          </div>
        </div>
        
        <!-- Dataset Detail Modal -->
        <div v-if="modalType === 'datasetDetail'" class="dataset-detail-modal">
          <div class="modal-header">
            <h2>📊 {{ modalData.title }}</h2>
            <div class="accuracy-badge">{{ modalData.accuracy }} Accuracy</div>
          </div>
          <div class="modal-body">
            <div class="insights-section">
              <h3>Key Insights</h3>
              <ul>
                <li v-for="insight in modalData.insights" :key="insight">💡 {{ insight }}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Network Detail Modal -->
        <div v-if="modalType === 'networkDetail'" class="network-detail-modal">
          <div class="modal-header">
            <h2>🌐 {{ modalData.title }}</h2>
            <div class="status-badge">{{ modalData.status }}</div>
          </div>
          <div class="modal-body">
            <div class="alerts-section">
              <h3>Recent Alerts</h3>
              <div v-for="alert in modalData.alerts" :key="alert" class="alert-item">⚠️ {{ alert }}</div>
            </div>
          </div>
        </div>
        
        <!-- Office Detail Modal -->
        <div v-if="modalType === 'officeDetail'" class="office-detail-modal">
          <div class="modal-header">
            <h2>🏢 {{ modalData.title }}</h2>
            <div class="office-type">{{ modalData.type }}</div>
          </div>
          <div class="modal-body">
            <div class="office-overview">
              <div class="overview-stat">
                <span class="stat-number">{{ modalData.employees }}</span>
                <span class="stat-text">Employees</span>
              </div>
              <div class="overview-stat">
                <span class="stat-number">{{ modalData.revenue }}</span>
                <span class="stat-text">Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
const isDark = ref(true)
const notification = ref(null)
const isLoading = ref(true)
const lastUpdated = ref(new Date())
const dataError = ref(null)

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const kpis = [
  { id: 1, title: 'Quarterly Revenue', value: '$28.5M', change: 23.8, trend: 'up', icon: '💰' },
  { id: 2, title: 'Market Growth', value: '23.8%', change: 8.3, trend: 'up', icon: '📈' },
  { id: 3, title: 'Operational Excellence', value: '94.2%', change: 5.7, trend: 'up', icon: '⚡' },
  { id: 4, title: 'Risk Assessment', value: '12.3', change: -15.2, trend: 'down', icon: '🛡️' }
]

const offices = [
  { id: 1, city: 'New York', x: 25, y: 35, tier: 'headquarters' },
  { id: 2, city: 'London', x: 50, y: 25, tier: 'regional' },
  { id: 3, city: 'Tokyo', x: 82, y: 38, tier: 'regional' },
  { id: 4, city: 'Singapore', x: 78, y: 52, tier: 'branch' },
  { id: 5, city: 'Dubai', x: 58, y: 42, tier: 'branch' },
  { id: 6, city: 'Cape Town', x: 52, y: 78, tier: 'regional' },
  { id: 7, city: 'Sandton', x: 54, y: 72, tier: 'branch' },
  { id: 8, city: 'Cairo', x: 55, y: 48, tier: 'branch' }
]

const stocks = [
  { symbol: 'AAPL', price: 175.43, change: 2.34 },
  { symbol: 'GOOGL', price: 2847.23, change: -1.23 },
  { symbol: 'MSFT', price: 378.85, change: 1.87 },
  { symbol: 'TSLA', price: 248.42, change: 4.56 },
  { symbol: 'AMZN', price: 3247.89, change: -0.89 }
]

const tickerPosition = ref(0)
const selectedStock = ref(null)
const currentMessage = ref('')
const messages = ref([
  {
    id: 1,
    type: 'ai',
    text: 'Good morning! I\'m ARIA, your AI Executive Assistant. I\'ve analyzed your latest metrics. How can I help you today?',
    time: '9:00 AM'
  }
])

const quickActions = [
  'Show revenue trends',
  'Team performance',
  'Market analysis',
  'Risk assessment'
]

// Holographic Data
const currentDataset = ref('Revenue')
const hologramMouseX = ref(0)
const hologramMouseY = ref(0)
const hologramRotation = ref(0)

const datasets = ['Revenue', 'Users', 'Performance']

const dataPoints = computed(() => {
  const data = {
    Revenue: [
      { label: 'Q1', value: '2.1M', height: 60 },
      { label: 'Q2', value: '2.8M', height: 80 },
      { label: 'Q3', value: '3.2M', height: 90 },
      { label: 'Q4', value: '3.8M', height: 100 }
    ],
    Users: [
      { label: 'Jan', value: '15K', height: 45 },
      { label: 'Feb', value: '18K', height: 65 },
      { label: 'Mar', value: '22K', height: 85 },
      { label: 'Apr', value: '28K', height: 95 }
    ],
    Performance: [
      { label: 'Speed', value: '94%', height: 75 },
      { label: 'Uptime', value: '99.9%', height: 98 },
      { label: 'Quality', value: '96%', height: 82 },
      { label: 'Satisfaction', value: '92%', height: 88 }
    ]
  }
  return data[currentDataset.value]
})

const particles = Array.from({ length: 8 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 2
}))

// Network Topology Data
const networkNodes = [
  { id: 1, name: 'Core Router', type: 'router', x: 400, y: 200, size: 25, status: 'online' },
  { id: 2, name: 'Web Server 1', type: 'server', x: 200, y: 100, size: 20, status: 'online' },
  { id: 3, name: 'Web Server 2', type: 'server', x: 600, y: 100, size: 20, status: 'online' },
  { id: 4, name: 'Database', type: 'database', x: 400, y: 50, size: 22, status: 'online' },
  { id: 5, name: 'Load Balancer', type: 'balancer', x: 400, y: 350, size: 18, status: 'online' },
  { id: 6, name: 'Firewall', type: 'security', x: 100, y: 200, size: 16, status: 'warning' },
  { id: 7, name: 'CDN Edge', type: 'cdn', x: 700, y: 300, size: 18, status: 'online' }
]

const networkConnections = [
  { id: 1, path: 'M 400 200 L 200 100', status: 'active', bandwidth: 0.8, animated: true },
  { id: 2, path: 'M 400 200 L 600 100', status: 'active', bandwidth: 0.7, animated: true },
  { id: 3, path: 'M 400 200 L 400 50', status: 'active', bandwidth: 0.9, animated: true },
  { id: 4, path: 'M 400 200 L 400 350', status: 'active', bandwidth: 0.6, animated: true },
  { id: 5, path: 'M 400 200 L 100 200', status: 'warning', bandwidth: 0.3, animated: false },
  { id: 6, path: 'M 400 200 L 700 300', status: 'active', bandwidth: 0.5, animated: true }
]

const networkStats = {
  totalNodes: 7,
  activeConnections: 6,
  throughput: '2.4 Gbps',
  latency: '12ms'
}

// Voice Command Data
const isListening = ref(false)
const waveAmplitudes = ref(Array(12).fill(0))

const voiceCommands = [
  'Show revenue report',
  'Update dashboard',
  'Generate forecast',
  'Export data',
  'Security status'
]

// Advanced Analytics Data
const forecastData = [
  { month: 'Jan', value: 2.8, height: 60 },
  { month: 'Feb', value: 3.2, height: 70 },
  { month: 'Mar', value: 3.8, height: 85 },
  { month: 'Apr', value: 4.2, height: 95 },
  { month: 'May', value: 4.8, height: 100 },
  { month: 'Jun', value: 5.2, height: 90 }
]

const performanceMetrics = [
  { name: 'Efficiency', value: 94 },
  { name: 'Quality', value: 87 },
  { name: 'Speed', value: 92 },
  { name: 'Reliability', value: 96 }
]

const globalStats = [
  { name: 'North America', flag: '🇺🇸', growth: 23.5, trend: 'up', revenue: 12.8 },
  { name: 'Europe', flag: '🇪🇺', growth: 18.2, trend: 'up', revenue: 8.4 },
  { name: 'Asia Pacific', flag: '🌏', growth: 31.7, trend: 'up', revenue: 6.2 },
  { name: 'Africa', flag: '🌍', growth: 42.1, trend: 'up', revenue: 1.1 }
]

// System Monitoring Data
const systemHealth = {
  status: 'healthy',
  metrics: [
    { name: 'CPU Usage', value: 68 },
    { name: 'Memory', value: 74 },
    { name: 'Disk I/O', value: 45 },
    { name: 'Network', value: 82 }
  ]
}

const apiMetrics = {
  totalRequests: 1247,
  responseTimes: [45, 52, 38, 61, 43, 55, 49, 67, 41, 58, 46, 53, 39, 62, 48]
}

const securityStatus = {
  level: 'secure',
  alerts: [
    { id: 1, severity: 'info', icon: '🛡️', message: 'All systems secure', time: '2 min ago' },
    { id: 2, severity: 'warning', icon: '⚠️', message: 'Unusual login pattern detected', time: '15 min ago' },
    { id: 3, severity: 'info', icon: '🔐', message: 'SSL certificates renewed', time: '1 hour ago' }
  ]
}

// Executive Profile System
const currentExecutive = ref({
  name: 'Wisani Chauke',
  title: 'Chief Executive Officer & Founder',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9InVybCgjZ3JhZGllbnQwKSIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjI0IiByPSIxMiIgZmlsbD0iI0ZGRiIvPgo8cGF0aCBkPSJNMTYgNTZjMC0xMiA3LjE2LTIwIDE2LTIwczE2IDggMTYgMjB2OEgxNnYtOHoiIGZpbGw9IiNGRkYiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSI2NCIgeTI9IjY0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNENEFGMzciLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMUUzQThBIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2Zz4K',
  clearanceLevel: 'FOUNDER ACCESS',
  status: 'online',
  lastLogin: '2024-01-15 09:23:45 UTC',
  sessionId: 'WC-FOUNDER-ALPHA'
})

const sessionTime = ref('00:00:00')
const sessionStart = Date.now()

// Executive Reports
const executiveReports = [
  {
    id: 1,
    title: 'Quantum Business Intelligence',
    description: 'AI-powered strategic insights with predictive modeling',
    type: 'Strategic AI',
    icon: '🔮',
    lastGenerated: '2 hours ago'
  },
  {
    id: 2,
    title: 'Galactic Risk Assessment',
    description: 'Multi-dimensional risk analysis across all sectors',
    type: 'Risk Intelligence',
    icon: '🛡️',
    lastGenerated: '4 hours ago'
  },
  {
    id: 3,
    title: 'Neural Market Analysis',
    description: 'Deep learning market predictions and opportunities',
    type: 'Market AI',
    icon: '🧠',
    lastGenerated: '1 hour ago'
  },
  {
    id: 4,
    title: 'Hyperdimensional Finance',
    description: 'Quantum financial modeling and cash flow optimization',
    type: 'Financial Quantum',
    icon: '💎',
    lastGenerated: '30 minutes ago'
  }
]

// Quantum Intelligence
const quantumMetrics = {
  processingPower: '847.2 TFLOPS',
  predictions: '2,847',
  accuracy: 99.7
}

const neuralNodes = Array.from({ length: 16 }, (_, i) => ({
  active: Math.random() > 0.3,
  connections: Math.floor(Math.random() * 4) + 1
}))

// Biometric Security
const biometricStatus = {
  status: 'AUTHENTICATED',
  confidence: 99.8,
  lastScan: '09:23:45',
  accessLevel: 'COSMIC'
}

const securityLogs = [
  {
    id: 1,
    action: 'Biometric Authentication',
    user: 'Wisani Chauke',
    timestamp: '09:23:45',
    location: 'Executive Suite',
    status: 'success',
    type: 'auth',
    icon: '🔐'
  },
  {
    id: 2,
    action: 'Quantum Encryption Activated',
    user: 'System',
    timestamp: '09:23:46',
    location: 'Global Network',
    status: 'success',
    type: 'security',
    icon: '🛡️'
  },
  {
    id: 3,
    action: 'Neural Network Sync',
    user: 'AI Core',
    timestamp: '09:24:12',
    location: 'Data Center Alpha',
    status: 'success',
    type: 'system',
    icon: '🧠'
  },
  {
    id: 4,
    action: 'Unauthorized Access Attempt',
    user: 'Unknown',
    timestamp: '08:47:23',
    location: 'External IP',
    status: 'blocked',
    type: 'threat',
    icon: '⚠️'
  }
]

const hologramStyle = computed(() => {
  const maxRotationX = Math.max(-10, Math.min(10, hologramMouseY.value * 0.03))
  const baseRotation = (hologramRotation.value % 360)
  const mouseRotation = Math.max(-15, Math.min(15, hologramMouseX.value * 0.03))
  const totalRotationY = baseRotation + mouseRotation
  return {
    transform: `rotateX(${maxRotationX}deg) rotateY(${totalRotationY}deg)`
  }
})

const showNotification = (message, type = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const generateReport = (report = null) => {
  if (report) {
    openModal('report', {
      title: report.title,
      type: report.type,
      pages: Math.floor(Math.random() * 50) + 20,
      insights: Math.floor(Math.random() * 100) + 50,
      charts: Math.floor(Math.random() * 15) + 8,
      recommendations: Math.floor(Math.random() * 10) + 5,
      preview: `Executive Summary: ${report.description}`,
      downloadUrl: '#',
      shareUrl: '#'
    })
  } else {
    openModal('presentation', {
      title: 'Executive Board Presentation',
      slides: 47,
      duration: '45 minutes',
      sections: ['Market Overview', 'Financial Performance', 'Strategic Initiatives', 'Risk Assessment', 'Future Outlook'],
      keyMetrics: ['Revenue: $28.5M (+23.8%)', 'Market Share: 34.2%', 'Customer Growth: +18%', 'Efficiency: 94.2%'],
      downloadUrl: '#'
    })
  }
}



const getHealthColor = (value) => {
  if (value >= 80) return 'var(--luxe-emerald)'
  if (value >= 60) return 'var(--luxe-amber)'
  return 'var(--luxe-crimson)'
}

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const refreshKPI = (kpiId) => {
  showNotification(`🔄 Refreshing KPI data...`, 'info')
  lastUpdated.value = new Date()
}

const onHologramTouchMove = (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    hologramMouseX.value = ((touch.clientX - rect.left) / rect.width - 0.5) * 60
    hologramMouseY.value = ((touch.clientY - rect.top) / rect.height - 0.5) * -60
  }
}

// Simulate data loading
setTimeout(() => {
  isLoading.value = false
  lastUpdated.value = new Date()
}, 2000)

const showSecurityLogs = () => {
  showNotification('🔐 Security logs accessed - Quantum encrypted transmission initiated', 'info')
}

const switchProfile = () => {
  showNotification('👤 Biometric scanner activated - Place finger on scanner', 'info')
}

const showModal = ref(false)
const modalType = ref('')
const modalData = ref(null)

const openModal = (type, data = null) => {
  modalType.value = type
  modalData.value = data
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalType.value = ''
  modalData.value = null
}

const openProfileModal = () => {
  openModal('profile', {
    name: currentExecutive.value.name,
    title: currentExecutive.value.title,
    clearance: currentExecutive.value.clearanceLevel,
    lastLogin: '2024-01-15 09:23:45 UTC',
    totalSessions: 1247,
    securityScore: 98.7,
    achievements: ['Quantum Pioneer', 'AI Visionary', 'Global Leader'],
    departments: ['Executive', 'Strategy', 'Innovation'],
    metrics: {
      decisionsToday: 23,
      reportsGenerated: 8,
      meetingsScheduled: 5,
      alertsResolved: 12
    }
  })
}

const viewProfile = () => {
  showProfileMenu.value = false
  showNotification('👤 Opening executive profile dashboard...', 'info')
}

const securitySettings = () => {
  showProfileMenu.value = false
  showNotification('🔒 Accessing quantum security protocols...', 'info')
}

const switchUser = () => {
  showProfileMenu.value = false
  showNotification('🔄 Biometric scanner activated - Authentication required', 'info')
}

const logout = () => {
  showProfileMenu.value = false
  showNotification('🚪 Secure logout initiated - Session terminated', 'info')
}

const sendToEmail = () => {
  showNotification('📧 Executive report sent to wisanichauke@stratos.com', 'success')
}

const openAnalytics = () => {
  showNotification('📈 Advanced Analytics Suite - Opening quantum data models...', 'info')
}

const openSecurityCenter = () => {
  showNotification('🛡️ Security Center - Accessing biometric protocols...', 'info')
}

const refreshAnalytics = (type) => {
  const messages = {
    revenue: '💰 Revenue forecasting models updated with quantum algorithms',
    performance: '⚡ Performance metrics synchronized with neural networks', 
    global: '🌍 Global insights refreshed - African markets showing 42% growth'
  }
  showNotification(messages[type] || 'Analytics refreshed', 'success')
}

const switchDataset = (dataset) => {
  currentDataset.value = dataset
  openModal('datasetDetail', {
    title: `${dataset} Analytics`,
    accuracy: '99.7%',
    insights: [
      'Q4 projections exceed targets by 23%',
      '847K active executives globally tracked',
      '99.7% uptime across all quantum nodes',
      'AI predictions showing 94.2% confidence'
    ]
  })
}

const selectDataPoint = (bar) => {
  showNotification(`📊 ${bar.label}: ${bar.value} - Quantum analysis: Trend positive, confidence 94.2%`, 'info')
}

const selectNetworkNode = (node) => {
  openModal('networkDetail', {
    title: `${node.name} Network Node`,
    status: node.status.toUpperCase(),
    alerts: [
      'High throughput detected: 2.4 Tbps',
      'Quantum encryption active',
      'Neural load balancing optimized',
      'All security protocols operational'
    ]
  })
}

const executeVoiceCommand = (command) => {
  openModal('voiceResult', {
    command: command,
    confidence: '97.3%',
    result: `Voice command "${command}" executed successfully`,
    actions: ['Dashboard Updated', 'Data Refreshed', 'Notifications Sent']
  })
}

const showOfficeDetails = (office) => {
  openModal('officeDetail', {
    title: `${office.city} Office`,
    type: office.tier.charAt(0).toUpperCase() + office.tier.slice(1),
    employees: Math.floor(Math.random() * 500) + 50,
    revenue: `$${(Math.random() * 10 + 1).toFixed(1)}M`
  })
}

const sendQuickMessage = (action) => {
  openModal('voiceResult', {
    command: action,
    confidence: '98.1%',
    result: `Quick action "${action}" completed successfully`,
    actions: ['Analysis Generated', 'Data Updated', 'Report Ready']
  })
}



const exportLogs = () => {
  showNotification('📤 Security logs exported - Quantum encrypted file generated', 'success')
}

const getParticleAnimation = (index) => ({
  animationDelay: `${index * 0.2}s`,
  transform: `rotate(${index * 45}deg) translateX(40px)`
})

// Update session timer
let sessionTimer
onMounted(() => {
  // Existing intervals...
  tickerInterval = setInterval(() => {
    tickerPosition.value -= 1
    if (tickerPosition.value <= -800) {
      tickerPosition.value = 0
    }
  }, 50)
  
  hologramInterval = setInterval(() => {
    hologramRotation.value += 0.5
  }, 100)
  
  // Session timer
  sessionTimer = setInterval(() => {
    const elapsed = Date.now() - sessionStart
    const hours = Math.floor(elapsed / 3600000)
    const minutes = Math.floor((elapsed % 3600000) / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)
    sessionTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
  
  // Neural network animation
  setInterval(() => {
    neuralNodes.forEach(node => {
      if (Math.random() > 0.7) {
        node.active = !node.active
      }
    })
  }, 2000)
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
  if (hologramInterval) clearInterval(hologramInterval)
  if (sessionTimer) clearInterval(sessionTimer)
})

const showKPIDetails = (kpi) => {
  const kpiData = {
    1: {
      title: 'Quarterly Revenue Analysis',
      value: '$28.5M',
      change: '+23.8%',
      trend: 'Exponential Growth',
      breakdown: {
        'Enterprise Sales': { value: '$18.2M', change: '+31%' },
        'Subscription Revenue': { value: '$7.8M', change: '+18%' },
        'Professional Services': { value: '$2.5M', change: '+12%' }
      },
      forecast: '$35.2M next quarter',
      insights: ['Strong enterprise adoption', 'Subscription model scaling', 'International expansion driving growth']
    },
    2: {
      title: 'Market Growth Analytics',
      value: '23.8%',
      change: '+8.3%',
      trend: 'Market Leadership',
      breakdown: {
        'Market Share': { value: '34.2%', change: '+5.1%' },
        'Customer Acquisition': { value: '847', change: '+28%' },
        'Brand Recognition': { value: '89%', change: '+12%' }
      },
      forecast: '28.5% projected growth',
      insights: ['AI integration advantage', 'Competitive moat strengthening', 'Premium positioning success']
    }
  }
  openModal('kpi', kpiData[kpi.id] || { title: kpi.title, value: kpi.value })
}



const selectStock = (stock) => {
  selectedStock.value = stock
  const stockInsights = {
    'AAPL': '🍎 Apple: Strong iPhone 15 sales | AI chip demand rising | Target: $185',
    'GOOGL': '🔍 Google: Cloud revenue +28% | AI integration accelerating | Target: $2950',
    'MSFT': '💻 Microsoft: Azure growth +31% | Copilot adoption strong | Target: $395',
    'TSLA': '⚡ Tesla: Model Y refresh | Energy storage +45% | Target: $275',
    'AMZN': '📦 Amazon: AWS dominance | Prime membership growth | Target: $3400'
  }
  showNotification(stockInsights[stock.symbol] || `${stock.symbol}: $${stock.price.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%)`, 'info')
}

// Animate ticker
let tickerInterval
onMounted(() => {
  tickerInterval = setInterval(() => {
    tickerPosition.value -= 1
    if (tickerPosition.value <= -800) {
      tickerPosition.value = 0
    }
  }, 50)
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
})

const sendMessage = () => {
  if (!currentMessage.value.trim()) return
  
  messages.value.push({
    id: Date.now(),
    type: 'user',
    text: currentMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  const userMsg = currentMessage.value.toLowerCase()
  currentMessage.value = ''
  
  setTimeout(() => {
    let response = 'Based on current data analysis, I recommend reviewing the dashboard metrics for detailed insights.'
    
    if (userMsg.includes('revenue')) {
      response = 'Revenue is trending upward with 23.8% growth. Key drivers: new customer acquisition (+15%) and upselling (+8.8%).'
    } else if (userMsg.includes('team')) {
      response = 'Team performance is strong across all departments. Engineering leads with 94% efficiency.'
    } else if (userMsg.includes('market')) {
      response = 'Market conditions are favorable with 18% growth in your sector. I recommend European expansion.'
    } else if (userMsg.includes('risk')) {
      response = 'Current risk level: LOW. Main risks: customer concentration (45% from top 3 clients) and tech debt.'
    }
    
    messages.value.push({
      id: Date.now(),
      type: 'ai',
      text: response,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  }, 1000)
}



// Holographic functions
const onHologramMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  hologramMouseX.value = ((e.clientX - rect.left) / rect.width - 0.5) * 60
  hologramMouseY.value = ((e.clientY - rect.top) / rect.height - 0.5) * -60
}

const getBarStyle = (bar, index) => ({
  height: `${bar.height}px`,
  left: `${20 + index * 20}%`,
  animationDelay: `${index * 0.2}s`
})

const getParticleStyle = (particle, index) => ({
  left: `${particle.x}%`,
  top: `${particle.y}%`,
  width: `${particle.size}px`,
  height: `${particle.size}px`,
  animationDelay: `${index * 0.3}s`
})





const getNodeColor = (type) => {
  const colors = {
    router: '#1A237E',
    server: '#2196F3',
    database: '#4CAF50',
    balancer: '#FF9800',
    security: '#F44336',
    cdn: '#9C27B0'
  }
  return colors[type] || '#666'
}

const getNodeGlow = (type) => getNodeColor(type)

const getNodeIcon = (type) => {
  const icons = {
    router: '⚡',
    server: '🖥️',
    database: '🗄️',
    balancer: '⚖️',
    security: '🛡️',
    cdn: '🌐'
  }
  return icons[type] || '●'
}

const getStatusColor = (status) => {
  const colors = {
    online: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    offline: '#666'
  }
  return colors[status] || '#666'
}

const getConnectionColor = (status) => {
  const colors = {
    active: '#00ff00',
    warning: '#ff9800',
    error: '#ff0000'
  }
  return colors[status] || '#666'
}

const getConnectionWidth = (bandwidth) => Math.max(1, bandwidth * 4)

// Voice functions
const toggleListening = () => {
  isListening.value = !isListening.value
  
  if (isListening.value) {
    startListening()
  } else {
    stopListening()
  }
}

const startListening = () => {
  // Animate wave bars
  const animateWaves = () => {
    if (isListening.value) {
      waveAmplitudes.value = waveAmplitudes.value.map(() => Math.random())
      setTimeout(animateWaves, 100)
    }
  }
  animateWaves()
  
  // Simulate voice recognition after 3 seconds
  setTimeout(() => {
    if (isListening.value) {
      const commands = [
        'Show me the revenue dashboard',
        'What are today\'s key metrics?',
        'Generate quarterly report',
        'Update team performance data'
      ]
      const command = commands[Math.floor(Math.random() * commands.length)]
      executeVoiceCommand(command)
      isListening.value = false
    }
  }, 3000)
}

const stopListening = () => {
  waveAmplitudes.value = Array(12).fill(0)
}



const getWaveBarStyle = (index) => {
  const amplitude = waveAmplitudes.value[index - 1] || 0
  return {
    height: `${Math.max(4, amplitude * 40)}px`,
    backgroundColor: isListening.value ? '#00ff00' : '#666',
    opacity: isListening.value ? 0.8 : 0.3
  }
}

// Auto rotation for hologram
let hologramInterval
onMounted(() => {
  // Existing ticker interval...
  tickerInterval = setInterval(() => {
    tickerPosition.value -= 1
    if (tickerPosition.value <= -800) {
      tickerPosition.value = 0
    }
  }, 50)
  
  // Hologram rotation
  hologramInterval = setInterval(() => {
    hologramRotation.value += 0.5
  }, 100)
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
  if (hologramInterval) clearInterval(hologramInterval)
})
</script>

<style scoped>
.executive-app {
  min-height: 100vh;
  background: var(--theme-background);
  color: var(--theme-text);
  transition: all 0.3s ease;
}

.executive-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  padding: 16px 0;
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-core {
  width: 20px;
  height: 20px;
  background: var(--royal-gradient);
  border-radius: 50%;
  box-shadow: var(--gold-glow);
  animation: glow 3s ease-in-out infinite alternate;
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  background: var(--royal-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 11px;
  font-weight: 600;
  color: var(--theme-textSecondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: scale(1.1);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.executive-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.executive-summary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #007AFF, #5856D6);
}

.executive-title {
  font-size: 42px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  background: var(--royal-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.summary-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  padding: 8px 16px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  font-size: 13px;
  font-weight: 600;
}

.btn-primary {
  background: var(--royal-gradient);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--gold-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.kpi-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.4);
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
  font-weight: 600;
  color: var(--theme-text);
}

.kpi-value {
  font-size: 32px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  color: var(--theme-text);
  margin-bottom: 8px;
}

.kpi-change {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  display: inline-block;
}

.kpi-change.up {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.kpi-change.down {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.globe-section {
  margin-top: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  margin-top: 48px;
  color: var(--theme-text);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--theme-border);
  
  &:first-of-type {
    margin-top: 0;
  }
}

.globe-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  padding: 32px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.globe {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #1e40af, #1e3a8a, #0f172a);
  position: relative;
  box-shadow: 
    inset -30px -30px 60px rgba(0,0,0,0.4),
    0 30px 60px rgba(0,0,0,0.3);
}

.office-pin {
  position: absolute;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.office-pin:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.pin-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.pin-dot.headquarters {
  background: #D4AF37;
  box-shadow: 0 0 20px #D4AF37;
  width: 16px;
  height: 16px;
}

.pin-dot.regional {
  background: #10B981;
  box-shadow: 0 0 15px #10B981;
}

.pin-dot.branch {
  background: #3B82F6;
  box-shadow: 0 0 12px #3B82F6;
  width: 10px;
  height: 10px;
}

.pin-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.office-pin:hover .pin-label {
  opacity: 1;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.notification.info {
  background: rgba(59, 130, 246, 0.9);
  color: white;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.5); }
  100% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.8); }
}

/* Responsive */
@media (max-width: 768px) {
  .executive-summary {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .executive-title {
    font-size: 28px;
  }
  
  .summary-meta {
    justify-content: center;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
// Advanced Analytics Styling
.analytics-section {
  margin-bottom: 32px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.analytics-card {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--luxe-shadow);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--luxe-shadow), var(--gold-glow);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--theme-text);
    margin: 0;
  }
}

.refresh-btn {
  background: var(--royal-gradient);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(180deg);
  }
}

.forecast-chart {
  height: 200px;
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 100%;
  padding: 20px 0;
}

.forecast-bar {
  width: 40px;
  background: var(--royal-gradient);
  border-radius: 4px 4px 0 0;
  position: relative;
  animation: barGrow 1s ease-out;
  box-shadow: var(--gold-glow);
  
  .bar-value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: 600;
    color: var(--luxe-gold);
  }
  
  .bar-label {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    color: var(--theme-textSecondary);
  }
}

@keyframes barGrow {
  from { height: 0; }
  to { height: var(--final-height); }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.metric-item {
  text-align: center;
}

.metric-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  position: relative;
}

.metric-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--theme-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-text);
}

.metric-name {
  font-size: 12px;
  color: var(--theme-textSecondary);
}

.global-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.region-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(212, 175, 55, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.region-flag {
  font-size: 24px;
}

.region-info {
  flex: 1;
}

.region-name {
  font-weight: 600;
  color: var(--theme-text);
  font-size: 14px;
}

.region-growth {
  font-size: 12px;
  font-weight: 600;
  
  &.up {
    color: var(--luxe-emerald);
  }
  
  &.down {
    color: var(--luxe-crimson);
  }
}

.region-revenue {
  font-size: 16px;
  font-weight: 700;
  color: var(--luxe-gold);
}

// Monitoring Styling
.monitoring-section {
  margin-bottom: 32px;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.monitor-card {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--luxe-shadow);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--theme-text);
    margin: 0;
  }
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  &.healthy {
    background: var(--luxe-emerald);
    box-shadow: 0 0 10px var(--luxe-emerald);
  }
  
  &.warning {
    background: var(--luxe-amber);
    box-shadow: 0 0 10px var(--luxe-amber);
  }
  
  &.critical {
    background: var(--luxe-crimson);
    box-shadow: 0 0 10px var(--luxe-crimson);
  }
}

.health-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.health-label {
  min-width: 80px;
  font-size: 12px;
  color: var(--theme-textSecondary);
}

.health-bar {
  flex: 1;
  height: 8px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.health-value {
  min-width: 40px;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text);
  text-align: right;
}

.api-status {
  font-size: 14px;
  font-weight: 600;
  color: var(--luxe-sapphire);
}

.api-chart {
  height: 120px;
  display: flex;
  align-items: end;
  justify-content: center;
}

.response-times {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 100px;
}

.response-bar {
  width: 8px;
  background: var(--sapphire-gradient);
  border-radius: 2px;
  animation: barPulse 2s ease-in-out infinite;
}

@keyframes barPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.security-level {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  
  &.secure {
    background: rgba(15, 76, 58, 0.2);
    color: var(--luxe-emerald);
  }
  
  &.warning {
    background: rgba(245, 158, 11, 0.2);
    color: var(--luxe-amber);
  }
  
  &.critical {
    background: rgba(220, 38, 38, 0.2);
    color: var(--luxe-crimson);
  }
}

.security-alerts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  
  &.info {
    background: rgba(59, 130, 246, 0.1);
  }
  
  &.warning {
    background: rgba(245, 158, 11, 0.1);
  }
  
  &.critical {
    background: rgba(220, 38, 38, 0.1);
  }
}

.alert-icon {
  font-size: 16px;
}

.alert-text {
  flex: 1;
  font-size: 12px;
  color: var(--theme-text);
}

.alert-time {
  font-size: 10px;
  color: var(--theme-textSecondary);
}

// Executive Reports Styling
.reports-section {
  margin-bottom: 32px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 8px;
}

.report-card {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--luxe-shadow);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--luxe-shadow), var(--gold-glow);
    border-color: var(--luxe-gold);
  }
}

.report-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--royal-gradient);
  border-radius: 16px;
  box-shadow: var(--gold-glow);
}

.report-info {
  flex: 1;
  padding: 0 8px;
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--theme-text);
    margin: 0 0 12px 0;
    line-height: 1.4;
  }
  
  p {
    font-size: 12px;
    color: var(--theme-textSecondary);
    margin: 0 0 16px 0;
    line-height: 1.6;
  }
}

.report-meta {
  display: flex;
  gap: 16px;
  font-size: 10px;
  margin-top: 12px;
}

.report-type {
  background: rgba(212, 175, 55, 0.1);
  color: var(--luxe-gold);
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
}

.report-time {
  color: var(--theme-textSecondary);
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid var(--theme-border);
}

.generate-btn {
  background: var(--royal-gradient);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--gold-glow);
  }
}
// Executive Profile Styling
.executive-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--theme-glass);
  border-radius: 16px;
  border: 1px solid var(--theme-border);
}

.profile-avatar {
  position: relative;
  
  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid var(--luxe-gold);
    box-shadow: var(--gold-glow);
  }
}

.status-ring {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--theme-surface);
  
  &.online {
    background: var(--luxe-emerald);
    box-shadow: 0 0 10px var(--luxe-emerald);
  }
}

.profile-info {
  flex: 1;
}

.exec-name {
  font-size: 24px;
  font-weight: 800;
  color: var(--theme-text);
  margin: 0 0 4px 0;
  font-family: 'Playfair Display', serif;
}

.exec-title {
  font-size: 14px;
  color: var(--luxe-gold);
  font-weight: 600;
  margin-bottom: 4px;
}

.exec-clearance {
  font-size: 11px;
  background: var(--royal-gradient);
  color: white;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 700;
  display: inline-block;
}

.profile-actions {
  display: flex;
  gap: 12px;
}

.security-btn, .switch-btn {
  padding: 8px 16px;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-glass);
  color: var(--theme-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--royal-gradient);
    color: white;
    transform: translateY(-2px);
  }
}

.btn-secondary {
  background: var(--emerald-gradient);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--emerald-glow);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--emerald-glow), 0 8px 24px rgba(15, 76, 58, 0.3);
  }
}

// Quantum Intelligence Styling
.quantum-section {
  margin-bottom: 32px;
}

.quantum-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.quantum-card {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.quantum-core {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 24px;
}

.quantum-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--luxe-gold);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  animation: quantumOrbit 4s linear infinite;
  box-shadow: 0 0 10px currentColor;
}

@keyframes quantumOrbit {
  from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
}

.quantum-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: var(--royal-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--gold-glow);
}

.quantum-pulse {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid var(--luxe-gold);
  border-radius: 50%;
  animation: quantumPulse 2s ease-in-out infinite;
}

@keyframes quantumPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.3; }
}

.quantum-text {
  font-size: 10px;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.quantum-stats {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-top: 24px;
}

.quantum-stat {
  text-align: center;
  flex: 1;
  padding: 12px;
  background: var(--theme-glass);
  border-radius: 12px;
  border: 1px solid var(--theme-border);
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  color: var(--luxe-gold);
  margin-bottom: 4px;
  font-family: 'Playfair Display', serif;
}

.stat-label {
  font-size: 10px;
  color: var(--theme-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.neural-network {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
}

.network-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 20px;
  text-align: center;
}

.neural-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.neural-node {
  width: 40px;
  height: 40px;
  position: relative;
  margin: 0 auto;
}

.node-core {
  width: 100%;
  height: 100%;
  background: var(--luxe-obsidian);
  border-radius: 50%;
  border: 2px solid var(--luxe-sapphire);
  transition: all 0.3s ease;
}

.neural-node.active .node-core {
  background: var(--luxe-sapphire);
  box-shadow: var(--sapphire-glow);
  animation: neuralPulse 1s ease-in-out infinite;
}

@keyframes neuralPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

// Biometric Security Styling
.biometric-section {
  margin-bottom: 32px;
}

.biometric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.biometric-scanner {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
}

.scanner-display {
  text-align: center;
  margin-bottom: 24px;
}

.fingerprint-scanner {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  position: relative;
  background: radial-gradient(circle, var(--luxe-obsidian), var(--luxe-onyx));
  border-radius: 50%;
  border: 3px solid var(--luxe-gold);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fingerprint-pattern {
  position: relative;
  width: 80px;
  height: 80px;
}

.print-line {
  position: absolute;
  border: 1px solid var(--luxe-gold);
  border-radius: 50%;
  opacity: 0.6;
  animation: fingerprintScan 3s ease-in-out infinite;
}

.print-line:nth-child(1) { width: 20px; height: 20px; top: 30px; left: 30px; }
.print-line:nth-child(2) { width: 30px; height: 30px; top: 25px; left: 25px; }
.print-line:nth-child(3) { width: 40px; height: 40px; top: 20px; left: 20px; }
.print-line:nth-child(4) { width: 50px; height: 50px; top: 15px; left: 15px; }
.print-line:nth-child(5) { width: 60px; height: 60px; top: 10px; left: 10px; }
.print-line:nth-child(6) { width: 70px; height: 70px; top: 5px; left: 5px; }

@keyframes fingerprintScan {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.scan-beam {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, var(--luxe-gold), transparent);
  animation: scanBeam 2s linear infinite;
}

@keyframes scanBeam {
  0% { left: 0; }
  100% { left: 100%; }
}

.scan-status {
  font-size: 14px;
  font-weight: 700;
  color: var(--luxe-emerald);
  text-transform: uppercase;
}

.biometric-data {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.bio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--theme-glass);
  border-radius: 8px;
  border: 1px solid var(--theme-border);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(212, 175, 55, 0.05);
    border-color: var(--luxe-gold);
  }
}

.bio-label {
  font-size: 12px;
  color: var(--theme-textSecondary);
}

.bio-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--luxe-gold);
}

.security-logs {
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 24px;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--theme-text);
    margin: 0;
  }
}

.export-btn {
  background: var(--sapphire-gradient);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--sapphire-glow);
  }
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &.auth {
    background: rgba(15, 76, 58, 0.1);
    border-left: 3px solid var(--luxe-emerald);
  }
  
  &.security {
    background: rgba(212, 175, 55, 0.1);
    border-left: 3px solid var(--luxe-gold);
  }
  
  &.system {
    background: rgba(30, 58, 138, 0.1);
    border-left: 3px solid var(--luxe-sapphire);
  }
  
  &.threat {
    background: rgba(220, 38, 38, 0.1);
    border-left: 3px solid var(--luxe-crimson);
  }
}

.log-icon {
  font-size: 16px;
}

.log-details {
  flex: 1;
}

.log-action {
  font-size: 13px;
  font-weight: 600;
  color: var(--theme-text);
}

.log-meta {
  display: flex;
  gap: 20px;
  font-size: 11px;
  color: var(--theme-textSecondary);
  margin-top: 6px;
}

.log-user {
  font-weight: 600;
}

.log-time {
  font-family: 'Monaco', 'Consolas', monospace;
}

.log-location {
  font-style: italic;
}

.log-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  
  &.success {
    background: rgba(15, 76, 58, 0.2);
    color: var(--luxe-emerald);
  }
  
  &.blocked {
    background: rgba(220, 38, 38, 0.2);
    color: var(--luxe-crimson);
  }
}
// Header Profile Styling
.profile-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--royal-gradient);
    color: white;
    transform: translateY(-2px);
  }
}

.mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--luxe-gold);
  box-shadow: var(--gold-glow);
}

.mini-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
}

.profile-mini:hover .mini-name {
  color: white;
}

.email-btn {
  background: var(--emerald-gradient);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--emerald-glow);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--emerald-glow), 0 6px 16px rgba(15, 76, 58, 0.3);
  }
}

.btn-tertiary {
  background: var(--sapphire-gradient);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--sapphire-glow);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--sapphire-glow), 0 8px 24px rgba(30, 58, 138, 0.3);
  }
}
// Profile Dropdown Styling
.profile-mini {
  position: relative;
  
  .profile-arrow {
    font-size: 12px;
    margin-left: 4px;
    transition: transform 0.3s ease;
  }
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 16px;
  padding: 16px;
  min-width: 280px;
  box-shadow: var(--luxe-shadow);
  z-index: 1000;
}

.current-user {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--theme-border);
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--luxe-gold);
  box-shadow: var(--gold-glow);
}

.dropdown-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 2px;
}

.dropdown-title {
  font-size: 12px;
  color: var(--luxe-gold);
  font-weight: 600;
  margin-bottom: 4px;
}

.dropdown-status {
  font-size: 11px;
  color: var(--luxe-emerald);
  font-weight: 600;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-action-btn {
  padding: 8px 12px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  color: var(--theme-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: var(--royal-gradient);
    color: white;
    transform: translateX(4px);
  }
  
  &.logout {
    border-color: var(--luxe-crimson);
    color: var(--luxe-crimson);
    
    &:hover {
      background: var(--luxe-crimson);
      color: white;
    }
  }
}
// Loading States & Error Handling
.refresh-mini {
  background: transparent;
  border: none;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    transform: rotate(180deg);
  }
}

.last-updated {
  font-size: 10px;
  color: var(--theme-textSecondary);
  margin-top: 8px;
  opacity: 0.8;
}

.data-status {
  font-size: 12px;
  color: var(--luxe-emerald);
  font-weight: 600;
  margin-left: 12px;
}

// Mobile Responsiveness
@media (max-width: 1024px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .quantum-grid {
    grid-template-columns: 1fr;
  }
  
  .biometric-grid {
    grid-template-columns: 1fr;
  }
  
  .monitoring-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .executive-header {
    padding: 12px 0;
  }
  
  .header-content {
    padding: 0 16px;
    flex-direction: column;
    gap: 16px;
  }
  
  .executive-controls {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .profile-dropdown {
    right: auto;
    left: 0;
    min-width: 260px;
  }
  
  .hologram-container {
    padding: 16px;
    height: 300px;
  }
  
  .globe-container {
    height: 300px;
    padding: 16px;
  }
  
  .globe {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .executive-summary {
    padding: 20px;
  }
  
  .executive-title {
    font-size: 28px;
  }
  
  .summary-meta {
    flex-direction: column;
    gap: 12px;
  }
  
  .kpi-card {
    padding: 16px;
  }
  
  .kpi-value {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .analytics-card,
  .monitor-card,
  .report-card {
    padding: 16px;
  }
  
  .quantum-core {
    width: 150px;
    height: 150px;
  }
  
  .fingerprint-scanner {
    width: 100px;
    height: 100px;
  }
}

// Touch-Friendly Interactions
@media (hover: none) and (pointer: coarse) {
  .kpi-card:hover,
  .analytics-card:hover,
  .report-card:hover {
    transform: none;
  }
  
  .kpi-card:active,
  .analytics-card:active,
  .report-card:active {
    transform: scale(0.98);
  }
  
  .stock-item {
    min-height: 48px;
    padding: 12px 24px;
  }
  
  .dataset-btn,
  .voice-cmd-btn,
  .quick-btn {
    min-height: 44px;
    padding: 12px 16px;
  }
  
  .theme-toggle {
    width: 56px;
    height: 56px;
  }
}

// Accessibility Improvements
.kpi-card,
.analytics-card,
.report-card {
  &:focus {
    outline: 2px solid var(--luxe-gold);
    outline-offset: 2px;
  }
}

.btn-primary,
.btn-secondary,
.btn-tertiary {
  &:focus {
    outline: 2px solid var(--luxe-gold);
    outline-offset: 2px;
  }
}

// High Contrast Mode Support
@media (prefers-contrast: high) {
  .executive-card {
    border-width: 2px;
  }
  
  .kpi-card {
    border-width: 2px;
  }
  
  .theme-text {
    font-weight: 600;
  }
}

// Reduced Motion Support
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .hologram-stage {
    transform: none !important;
  }
  
  .quantum-particles .particle {
    animation: none;
  }
}
// Elite Profile Card Styling
.executive-profile-card {
  position: relative;
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-width: 280px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--luxe-shadow), var(--gold-glow);
    border-color: var(--luxe-gold);
    
    &::before {
      left: 100%;
    }
    
    .profile-glow {
      opacity: 1;
      transform: scale(1.2);
    }
  }
}

.profile-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--luxe-gold) 0%, transparent 70%);
  opacity: 0;
  transition: all 0.6s ease;
  pointer-events: none;
  z-index: 0;
}

.profile-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar-container {
  position: relative;
}

.elite-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid var(--luxe-gold);
  box-shadow: var(--gold-glow);
  transition: all 0.4s ease;
}

.status-pulse {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: var(--luxe-emerald);
  border-radius: 50%;
  border: 2px solid var(--theme-surface);
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.clearance-badge {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--royal-gradient);
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.profile-details {
  flex: 1;
}

.exec-name-elite {
  font-size: 18px;
  font-weight: 800;
  color: var(--theme-text);
  margin-bottom: 2px;
  font-family: 'Playfair Display', serif;
}

.exec-title-elite {
  font-size: 12px;
  color: var(--luxe-gold);
  font-weight: 600;
  margin-bottom: 6px;
}

.session-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--theme-textSecondary);
}

.session-dot {
  width: 6px;
  height: 6px;
  background: var(--luxe-emerald);
  border-radius: 50%;
  animation: sessionBlink 3s ease-in-out infinite;
}

@keyframes sessionBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

// Elite Modal System
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: var(--theme-glass);
  backdrop-filter: blur(32px);
  border: 1px solid var(--theme-border);
  border-radius: 24px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--luxe-shadow), var(--gold-glow);
}

@keyframes modalSlideIn {
  from { transform: translateY(50px) scale(0.9); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--theme-border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--theme-text);
  font-size: 14px;
  transition: all 0.3s ease;
  z-index: 1;
  
  &:hover {
    background: var(--luxe-crimson);
    color: white;
    transform: rotate(90deg);
  }
}

// Profile Modal
.profile-modal {
  width: 600px;
  padding: 32px;
}

.profile-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.hero-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid var(--luxe-gold);
  box-shadow: var(--gold-glow);
}

.hero-info h2 {
  font-size: 28px;
  font-weight: 800;
  color: var(--theme-text);
  margin: 0 0 8px 0;
  font-family: 'Playfair Display', serif;
}

.hero-info p {
  font-size: 16px;
  color: var(--luxe-gold);
  font-weight: 600;
  margin: 0 0 12px 0;
}

.clearance-display {
  background: var(--royal-gradient);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--gold-glow);
  }
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--luxe-gold);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: var(--theme-textSecondary);
  font-weight: 600;
}

.achievements h3 {
  color: var(--theme-text);
  margin-bottom: 16px;
}

.achievement-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.achievement-badge {
  background: var(--royal-gradient);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

// Report Modal
.report-modal {
  width: 700px;
  padding: 32px;
}

.modal-header h2 {
  color: var(--theme-text);
  margin: 0 0 8px 0;
  font-size: 24px;
}

.report-meta {
  color: var(--theme-textSecondary);
  font-size: 14px;
  margin-bottom: 24px;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.preview-stat {
  text-align: center;
  padding: 16px;
  background: var(--theme-glass);
  border-radius: 12px;
  border: 1px solid var(--theme-border);
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: var(--luxe-gold);
  margin-bottom: 4px;
}

.stat-text {
  font-size: 12px;
  color: var(--theme-textSecondary);
}

.report-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 8px;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &.primary {
    background: var(--royal-gradient);
    color: white;
  }
  
  &.secondary {
    background: var(--emerald-gradient);
    color: white;
  }
  
  &.tertiary {
    background: var(--sapphire-gradient);
    color: white;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--gold-glow);
  }
}

// KPI Modal
.kpi-modal {
  width: 650px;
  padding: 32px;
}

.kpi-trend {
  color: var(--luxe-emerald);
  font-size: 14px;
  font-weight: 600;
}

.kpi-overview {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: var(--theme-glass);
  border-radius: 16px;
  border: 1px solid var(--theme-border);
}

.kpi-main-value {
  font-size: 48px;
  font-weight: 800;
  color: var(--luxe-gold);
  margin-bottom: 8px;
  font-family: 'Playfair Display', serif;
}

.kpi-change {
  font-size: 18px;
  font-weight: 600;
  color: var(--luxe-emerald);
}

.kpi-breakdown {
  margin-bottom: 24px;
}

.kpi-breakdown h3 {
  color: var(--theme-text);
  margin-bottom: 16px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--theme-border);
}

.breakdown-label {
  color: var(--theme-text);
  font-weight: 600;
}

.breakdown-value {
  color: var(--luxe-gold);
  font-weight: 700;
}

.breakdown-change {
  color: var(--luxe-emerald);
  font-weight: 600;
  font-size: 14px;
}

.kpi-insights h3 {
  color: var(--theme-text);
  margin-bottom: 12px;
}

.kpi-insights ul {
  list-style: none;
  padding: 0;
}

.kpi-insights li {
  padding: 8px 0;
  color: var(--theme-textSecondary);
  position: relative;
  padding-left: 20px;
  
  &::before {
    content: '💡';
    position: absolute;
    left: 0;
  }
}
// Executive Profile Suite Styling
.executive-profile-suite {
  position: relative;
  cursor: pointer;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--theme-glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 200px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--luxe-shadow), var(--gold-glow);
    border-color: var(--luxe-gold);
  }
}

.avatar-stack {
  position: relative;
  width: 48px;
  height: 48px;
}

.avatar-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: var(--royal-gradient);
  animation: avatarPulse 3s ease-in-out infinite;
}

@keyframes avatarPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.avatar-container {
  position: relative;
  width: 48px;
  height: 48px;
  background: var(--royal-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.avatar-initials {
  font-size: 18px;
  font-weight: 800;
  color: white;
  font-family: 'Playfair Display', serif;
}

.avatar-crown {
  position: absolute;
  top: -8px;
  right: -4px;
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.status-orb {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: var(--luxe-emerald);
  border: 2px solid var(--theme-surface);
  border-radius: 50%;
  animation: statusBlink 2s ease-in-out infinite;
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.profile-text {
  flex: 1;
}

.exec-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 2px;
  font-family: 'Playfair Display', serif;
}

.exec-role {
  font-size: 11px;
  color: var(--luxe-gold);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-indicator {
  font-size: 12px;
  color: var(--theme-textSecondary);
  transition: all 0.3s ease;
  
  &.active {
    transform: rotate(180deg);
    color: var(--luxe-gold);
  }
}

// Elite Profile Dropdown
.profile-dropdown-elite {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: var(--theme-glass);
  backdrop-filter: blur(32px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  box-shadow: var(--luxe-shadow), var(--gold-glow);
  z-index: 1000;
  animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--royal-gradient);
  }
}

@keyframes dropdownSlide {
  from { 
    opacity: 0; 
    transform: translateY(-10px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

.dropdown-header {
  padding: 24px;
  border-bottom: 1px solid var(--theme-border);
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(15, 76, 58, 0.05));
}

.header-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  background: var(--royal-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--gold-glow);
}

.header-initials {
  font-size: 20px;
  font-weight: 800;
  color: white;
  font-family: 'Playfair Display', serif;
}

.online-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 12px;
  background: var(--theme-surface);
  border-radius: 50%;
  padding: 2px;
}

.header-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--theme-text);
  margin: 0 0 4px 0;
  font-family: 'Playfair Display', serif;
}

.header-info p {
  font-size: 12px;
  color: var(--luxe-gold);
  font-weight: 600;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clearance-chip {
  background: var(--royal-gradient);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-stats {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid var(--theme-border);
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.stat-icon {
  font-size: 14px;
}

.stat-text {
  color: var(--theme-textSecondary);
  font-weight: 500;
}

.dropdown-actions {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--theme-glass);
  border: 1px solid var(--theme-border);
  border-radius: 12px;
  color: var(--theme-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: var(--gold-glow);
    border-color: var(--luxe-gold);
  }
  
  &.primary {
    background: var(--royal-gradient);
    color: white;
    border-color: transparent;
    
    &:hover {
      box-shadow: var(--gold-glow), 0 4px 12px rgba(212, 175, 55, 0.3);
    }
  }
  
  &.danger {
    border-color: var(--luxe-crimson);
    color: var(--luxe-crimson);
    
    &:hover {
      background: var(--luxe-crimson);
      color: white;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  }
}

.btn-icon {
  font-size: 16px;
}

// Click outside to close dropdown
@media (max-width: 768px) {
  .profile-dropdown-elite {
    width: 280px;
    right: -20px;
  }
  
  .profile-main {
    min-width: 160px;
  }
  
  .exec-name {
    font-size: 14px;
  }
  
  .exec-role {
    font-size: 10px;
  }
}
// Impressive Executive Profile Styling
.profile-main-impressive {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.1) 0%, 
    rgba(15, 76, 58, 0.1) 35%, 
    rgba(30, 58, 138, 0.1) 70%, 
    rgba(10, 10, 11, 0.1) 100%);
  backdrop-filter: blur(32px);
  border: 2px solid transparent;
  border-radius: 28px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 280px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: var(--royal-gradient);
    border-radius: 28px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(212, 175, 55, 0.2),
      0 0 60px rgba(212, 175, 55, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}

.avatar-complex {
  position: relative;
  width: 64px;
  height: 64px;
}

.avatar-outer-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    var(--luxe-gold) 0deg,
    var(--luxe-emerald) 90deg,
    var(--luxe-sapphire) 180deg,
    var(--luxe-obsidian) 270deg,
    var(--luxe-gold) 360deg
  );
  animation: avatarRotate 8s linear infinite;
}

.avatar-middle-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: var(--theme-surface);
  animation: avatarPulse 3s ease-in-out infinite;
}

.avatar-core {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--royal-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
}

.avatar-gradient {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-portrait {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(247, 231, 206, 0.9) 0%,
    rgba(212, 175, 55, 0.7) 50%,
    rgba(10, 10, 11, 0.8) 100%
  );
  overflow: hidden;
}

.portrait-silhouette {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  background: var(--luxe-obsidian);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  
  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 20px;
    background: var(--luxe-obsidian);
    border-radius: 0 0 16px 16px;
  }
}

.portrait-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.3) 0%,
    transparent 70%
  );
  animation: portraitGlow 4s ease-in-out infinite;
}

.avatar-initials-premium {
  position: absolute;
  font-size: 20px;
  font-weight: 900;
  color: white;
  font-family: 'Playfair Display', serif;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 0 10px rgba(212, 175, 55, 0.5);
  z-index: 2;
}

.executive-insignia {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}

.insignia-star {
  font-size: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: insigniaTwinkle 2s ease-in-out infinite;
}

.insignia-crown {
  font-size: 16px;
  margin-top: -4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.status-constellation {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
}

.status-star {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--luxe-emerald);
  border-radius: 50%;
  
  &.main {
    width: 12px;
    height: 12px;
    border: 2px solid var(--theme-surface);
    animation: statusPulse 2s ease-in-out infinite;
  }
  
  &.orbit {
    width: 4px;
    height: 4px;
    top: 2px;
    right: 2px;
    background: var(--luxe-gold);
    animation: orbitStar 3s linear infinite;
  }
}

.profile-info-premium {
  flex: 1;
  padding: 0 8px;
}

.exec-name-impressive {
  font-size: 18px;
  font-weight: 800;
  color: var(--theme-text);
  margin-bottom: 2px;
  font-family: 'Playfair Display', serif;
  background: var(--royal-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.exec-title-impressive {
  font-size: 11px;
  color: var(--luxe-gold);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.exec-status-premium {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  color: var(--theme-textSecondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-indicator-premium {
  width: 6px;
  height: 6px;
  background: var(--luxe-emerald);
  border-radius: 50%;
  animation: statusBlink 2s ease-in-out infinite;
}

.dropdown-chevron-premium {
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.active {
    transform: rotate(180deg);
  }
}

.chevron-premium {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--luxe-gold);
  border-bottom: 2px solid var(--luxe-gold);
  transform: translate(-50%, -50%) rotate(45deg);
  transition: all 0.3s ease;
}

// Animations
@keyframes avatarRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes portraitGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

@keyframes insigniaTwinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

@keyframes orbitStar {
  from { transform: rotate(0deg) translateX(8px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(8px) rotate(-360deg); }
}

@keyframes statusPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
// Ultra-Impressive Quantum Profile Styling
.executive-profile-quantum {
  position: relative;
  cursor: pointer;
  perspective: 1000px;
}

.profile-holographic {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.15) 0%, 
    rgba(15, 76, 58, 0.15) 25%, 
    rgba(30, 58, 138, 0.15) 50%, 
    rgba(10, 10, 11, 0.15) 75%,
    rgba(212, 175, 55, 0.15) 100%);
  backdrop-filter: blur(40px);
  border: 3px solid transparent;
  border-radius: 32px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 320px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 3px;
    background: conic-gradient(
      from 0deg,
      var(--luxe-gold) 0deg,
      var(--luxe-emerald) 72deg,
      var(--luxe-sapphire) 144deg,
      var(--luxe-obsidian) 216deg,
      var(--luxe-gold) 288deg,
      var(--luxe-emerald) 360deg
    );
    border-radius: 32px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    animation: quantumBorder 4s linear infinite;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(212, 175, 55, 0.3), 
      rgba(15, 76, 58, 0.3),
      rgba(30, 58, 138, 0.3),
      transparent
    );
    animation: holographicSweep 3s ease-in-out infinite;
  }
  
  &:hover {
    transform: translateY(-6px) rotateX(5deg) scale(1.03);
    box-shadow: 
      0 30px 60px rgba(212, 175, 55, 0.3),
      0 0 100px rgba(212, 175, 55, 0.2),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
  }
}

.avatar-quantum-field {
  position: relative;
  width: 80px;
  height: 80px;
}

.quantum-ring-1, .quantum-ring-2, .quantum-ring-3 {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
}

.quantum-ring-1 {
  inset: -8px;
  border-color: var(--luxe-gold);
  animation: quantumSpin 6s linear infinite;
}

.quantum-ring-2 {
  inset: -4px;
  border-color: var(--luxe-emerald);
  animation: quantumSpin 4s linear infinite reverse;
}

.quantum-ring-3 {
  inset: 0;
  border-color: var(--luxe-sapphire);
  animation: quantumSpin 8s linear infinite;
}

.holographic-field {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.1) 0%,
    rgba(15, 76, 58, 0.1) 33%,
    rgba(30, 58, 138, 0.1) 66%,
    transparent 100%
  );
  animation: holographicPulse 3s ease-in-out infinite;
}

.quantum-core {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--royal-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
  box-shadow: 
    0 0 30px rgba(212, 175, 55, 0.5),
    inset 0 2px 10px rgba(255, 255, 255, 0.2);
}

.holographic-avatar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantum-portrait {
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(247, 231, 206, 0.95) 0%,
    rgba(212, 175, 55, 0.8) 40%,
    rgba(15, 76, 58, 0.6) 70%,
    rgba(10, 10, 11, 0.9) 100%
  );
  overflow: hidden;
}

.ceo-silhouette {
  position: relative;
  width: 100%;
  height: 100%;
}

.face-outline {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 28px;
  background: var(--luxe-obsidian);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.suit-outline {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 24px;
  background: var(--luxe-obsidian);
  border-radius: 0 0 18px 18px;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 16px;
    background: var(--luxe-gold);
    border-radius: 0 0 4px 4px;
  }
}

.power-aura {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.4) 0%,
    rgba(212, 175, 55, 0.2) 50%,
    transparent 100%
  );
  animation: powerPulse 2s ease-in-out infinite;
}

.quantum-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.3) 0%,
    rgba(15, 76, 58, 0.2) 33%,
    rgba(30, 58, 138, 0.2) 66%,
    transparent 100%
  );
  animation: quantumGlow 4s ease-in-out infinite;
}

.holographic-scan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--luxe-gold), transparent);
  animation: holographicScan 2s linear infinite;
}

.quantum-initials {
  position: absolute;
  font-size: 24px;
  font-weight: 900;
  color: white;
  font-family: 'Playfair Display', serif;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(212, 175, 55, 0.8),
    0 0 40px rgba(212, 175, 55, 0.4);
  z-index: 3;
  animation: initialsGlow 3s ease-in-out infinite;
}

.founder-badge {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--royal-gradient);
  color: white;
  font-size: 7px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  z-index: 4;
}

.quantum-insignia {
  position: absolute;
  top: -12px;
  right: -12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
}

.quantum-star {
  font-size: 16px;
  filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.6));
  animation: quantumTwinkle 2s ease-in-out infinite;
}

.quantum-crown {
  font-size: 20px;
  margin-top: -6px;
  filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.8));
  animation: crownFloat 3s ease-in-out infinite;
}

.power-symbol {
  font-size: 12px;
  margin-top: -4px;
  filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.8));
  animation: powerFlash 1.5s ease-in-out infinite;
}

.quantum-constellation {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
}

.quantum-node {
  position: absolute;
  border-radius: 50%;
  background: var(--luxe-emerald);
  
  &.main {
    width: 16px;
    height: 16px;
    border: 3px solid var(--theme-surface);
    animation: quantumPulse 2s ease-in-out infinite;
    box-shadow: 0 0 20px var(--luxe-emerald);
  }
  
  &.orbit-1 {
    width: 6px;
    height: 6px;
    top: 2px;
    right: 2px;
    background: var(--luxe-gold);
    animation: quantumOrbit1 3s linear infinite;
  }
  
  &.orbit-2 {
    width: 4px;
    height: 4px;
    top: 8px;
    right: 8px;
    background: var(--luxe-sapphire);
    animation: quantumOrbit2 4s linear infinite;
  }
  
  &.orbit-3 {
    width: 3px;
    height: 3px;
    bottom: 2px;
    left: 2px;
    background: var(--luxe-emerald);
    animation: quantumOrbit3 5s linear infinite;
  }
}

.quantum-profile-info {
  flex: 1;
  padding: 0 12px;
}

.quantum-name {
  position: relative;
  margin-bottom: 6px;
}

.name-glow {
  font-size: 20px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  background: var(--royal-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
  animation: nameShimmer 4s ease-in-out infinite;
}

.name-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &::before, &::after {
    content: '✨';
    position: absolute;
    font-size: 8px;
    color: var(--luxe-gold);
    animation: particleFloat 3s ease-in-out infinite;
  }
  
  &::before {
    top: -4px;
    left: 10%;
    animation-delay: 0s;
  }
  
  &::after {
    top: -2px;
    right: 15%;
    animation-delay: 1.5s;
  }
}

.quantum-title {
  position: relative;
  margin-bottom: 8px;
}

.title-text {
  font-size: 12px;
  color: var(--luxe-gold);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.title-underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 1px;
  background: var(--royal-gradient);
  animation: underlineGrow 3s ease-in-out infinite;
}

.quantum-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantum-pulse {
  width: 8px;
  height: 8px;
  background: var(--luxe-emerald);
  border-radius: 50%;
  animation: quantumStatusPulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px var(--luxe-emerald);
}

.status-text {
  font-size: 10px;
  color: var(--theme-textSecondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.quantum-chevron {
  position: relative;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.4s ease;
  
  &.active {
    transform: rotate(180deg);
  }
}

.chevron-hologram {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-right: 3px solid var(--luxe-gold);
  border-bottom: 3px solid var(--luxe-gold);
  transform: translate(-50%, -50%) rotate(45deg);
  transition: all 0.4s ease;
  filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.4));
}

.chevron-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent);
  border-radius: 50%;
  animation: chevronGlow 2s ease-in-out infinite;
}

// Quantum Animations
@keyframes quantumBorder {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes holographicSweep {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

@keyframes quantumSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes holographicPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes powerPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes quantumGlow {
  0%, 100% { opacity: 0.3; }
  33% { opacity: 0.6; }
  66% { opacity: 0.4; }
}

@keyframes holographicScan {
  0% { top: 0; }
  100% { top: 100%; }
}

@keyframes initialsGlow {
  0%, 100% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.8); }
  50% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 1), 0 0 60px rgba(15, 76, 58, 0.6); }
}

@keyframes quantumTwinkle {
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.7; transform: scale(1.3) rotate(180deg); }
}

@keyframes crownFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}

@keyframes powerFlash {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes quantumPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

@keyframes quantumOrbit1 {
  from { transform: rotate(0deg) translateX(12px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
}

@keyframes quantumOrbit2 {
  from { transform: rotate(0deg) translateX(8px) rotate(0deg); }
  to { transform: rotate(-360deg) translateX(8px) rotate(360deg); }
}

@keyframes quantumOrbit3 {
  from { transform: rotate(0deg) translateX(10px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
}

@keyframes nameShimmer {
  0%, 100% { filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3)); }
  50% { filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 20px rgba(15, 76, 58, 0.4)); }
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-8px) rotate(180deg); opacity: 1; }
}

@keyframes underlineGrow {
  0% { width: 0%; }
  50% { width: 100%; }
  100% { width: 0%; }
}

@keyframes quantumStatusPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

@keyframes chevronGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
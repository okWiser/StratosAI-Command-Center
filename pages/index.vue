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
          <button @click="toggleTheme" class="theme-toggle">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
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
              <div class="meta-item">
                <span>🛡️ Quantum Encrypted</span>
              </div>
              <div class="meta-item">
                <span>🧠 AI Intelligence Active</span>
              </div>
              <div class="meta-item">
                <span>🌍 Global Operations Live</span>
              </div>
            </div>
          </div>
          
          <div class="executive-controls">
            <button @click="generateReport" class="btn-primary">
              📊 Board Presentation
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.id" class="kpi-card" @click="showKPIDetails(kpi)">
            <div class="kpi-header">
              <div class="kpi-icon">{{ kpi.icon }}</div>
              <div class="kpi-title">{{ kpi.title }}</div>
            </div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-change" :class="kpi.trend">
              {{ kpi.change > 0 ? '+' : '' }}{{ kpi.change }}%
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
          <div class="section-title">Holographic Analytics</div>
          <div class="hologram-container" @mousemove="onHologramMouseMove">
            <div class="hologram-stage" :style="hologramStyle">
              <div v-for="(bar, index) in dataPoints" :key="index" 
                   class="data-bar" 
                   :style="getBarStyle(bar, index)"
                   @click="selectDataPoint(bar)">
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
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
const isDark = ref(false)
const notification = ref(null)

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
  { id: 5, city: 'Dubai', x: 58, y: 42, tier: 'branch' }
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

const hologramStyle = computed(() => ({
  transform: `rotateX(${hologramMouseY.value * 0.1}deg) rotateY(${hologramMouseX.value * 0.1 + hologramRotation.value}deg)`
}))

const showNotification = (message, type = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const generateReport = () => {
  showNotification('Executive board presentation generated successfully!', 'success')
}

const showKPIDetails = (kpi) => {
  showNotification(`Opening detailed analytics for ${kpi.title}`, 'info')
}

const showOfficeDetails = (office) => {
  showNotification(`Connecting to ${office.city} office - ${office.tier} tier`, 'info')
}

const selectStock = (stock) => {
  selectedStock.value = stock
  showNotification(`${stock.symbol}: $${stock.price.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%)`, 'info')
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

const sendQuickMessage = (action) => {
  currentMessage.value = action
  sendMessage()
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

const switchDataset = (dataset) => {
  currentDataset.value = dataset
  showNotification(`Switched to ${dataset} analytics`, 'info')
}

const selectDataPoint = (bar) => {
  showNotification(`${bar.label}: ${bar.value} - Detailed analysis available`, 'info')
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
  background: linear-gradient(45deg, #D4AF37, #F59E0B);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
  animation: glow 3s ease-in-out infinite alternate;
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #D4AF37, #F59E0B);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.executive-summary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #D4AF37, #F59E0B);
}

.executive-title {
  font-size: 42px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #D4AF37, #F59E0B);
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
  background: linear-gradient(135deg, #D4AF37, #F59E0B);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
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
  color: var(--theme-text);
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
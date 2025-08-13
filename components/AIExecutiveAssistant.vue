<template>
  <v-card class="executive-card ai-assistant" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-avatar class="mr-3" size="32">
        <div class="ai-avatar">
          <div class="ai-core"></div>
          <div class="ai-ring"></div>
        </div>
      </v-avatar>
      ARIA - AI Executive Assistant
      <v-spacer />
      <v-chip :color="isOnline ? 'success' : 'error'" variant="tonal" size="small">
        {{ isOnline ? 'Online' : 'Offline' }}
      </v-chip>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <div class="chat-container">
        <div class="messages-area" ref="messagesArea">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="message"
            :class="message.type"
          >
            <div v-if="message.type === 'ai'" class="message-avatar">
              <div class="ai-mini-avatar"></div>
            </div>
            
            <div class="message-content">
              <div class="message-bubble" :class="message.type">
                <div v-if="message.typing" class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
                <div v-else>
                  <div v-if="message.type === 'ai'" class="ai-response">
                    <div class="response-header">
                      <v-icon size="16" color="primary">mdi-brain</v-icon>
                      <span class="ml-1">ARIA Analysis</span>
                    </div>
                    <div class="response-text">{{ message.text }}</div>
                    <div v-if="message.actions" class="response-actions mt-2">
                      <v-btn 
                        v-for="action in message.actions" 
                        :key="action.label"
                        @click="executeAction(action)"
                        size="small" 
                        variant="outlined" 
                        color="primary"
                        class="mr-2 mb-1"
                      >
                        <v-icon start size="16">{{ action.icon }}</v-icon>
                        {{ action.label }}
                      </v-btn>
                    </div>
                  </div>
                  <div v-else>{{ message.text }}</div>
                </div>
              </div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
        </div>
        
        <div class="quick-actions mb-3">
          <v-chip-group>
            <v-chip 
              v-for="action in quickActions" 
              :key="action.text"
              @click="sendQuickMessage(action.text)"
              size="small"
              variant="outlined"
            >
              <v-icon start size="16">{{ action.icon }}</v-icon>
              {{ action.text }}
            </v-chip>
          </v-chip-group>
        </div>
        
        <div class="input-area">
          <v-text-field
            v-model="currentMessage"
            @keyup.enter="sendMessage"
            placeholder="Ask ARIA anything about your business..."
            variant="outlined"
            density="compact"
            :loading="isTyping"
            hide-details
          >
            <template #prepend-inner>
              <v-icon color="primary">mdi-message-text</v-icon>
            </template>
            <template #append-inner>
              <v-btn 
                @click="sendMessage"
                :disabled="!currentMessage.trim()"
                icon="mdi-send"
                variant="text"
                size="small"
                color="primary"
              />
            </template>
          </v-text-field>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const currentMessage = ref('')
const isTyping = ref(false)
const isOnline = ref(true)
const messagesArea = ref(null)

const quickActions = [
  { text: 'Show revenue trends', icon: 'mdi-chart-line' },
  { text: 'Team performance', icon: 'mdi-account-group' },
  { text: 'Market analysis', icon: 'mdi-earth' },
  { text: 'Risk assessment', icon: 'mdi-shield-alert' }
]

const messages = ref([
  {
    type: 'ai',
    text: 'Good morning! I\'m ARIA, your AI Executive Assistant. I\'ve analyzed your latest business metrics and I\'m ready to provide strategic insights. How can I help you today?',
    time: '9:00 AM',
    actions: [
      { label: 'Daily Brief', icon: 'mdi-newspaper', action: 'daily-brief' },
      { label: 'KPI Summary', icon: 'mdi-chart-box', action: 'kpi-summary' }
    ]
  }
])

const aiResponses = {
  'show revenue trends': {
    text: 'Revenue is trending upward with a 23.8% growth rate this quarter. Key drivers include: 1) New customer acquisition (+15%), 2) Upselling to existing clients (+8.8%). I recommend focusing on the enterprise segment for Q4.',
    actions: [
      { label: 'View Details', icon: 'mdi-chart-line', action: 'revenue-details' },
      { label: 'Export Report', icon: 'mdi-download', action: 'export-revenue' }
    ]
  },
  'team performance': {
    text: 'Team performance is strong across all departments. Engineering leads with 94% efficiency, Sales at 87%, Marketing at 91%. I\'ve identified 3 optimization opportunities that could boost overall performance by 12%.',
    actions: [
      { label: 'Team Analysis', icon: 'mdi-account-group', action: 'team-analysis' },
      { label: 'Schedule Review', icon: 'mdi-calendar', action: 'schedule-review' }
    ]
  },
  'market analysis': {
    text: 'Market conditions are favorable with 18% growth in your sector. Competitors are struggling with supply chain issues, creating a 6-month opportunity window. I recommend aggressive expansion in the European market.',
    actions: [
      { label: 'Market Report', icon: 'mdi-earth', action: 'market-report' },
      { label: 'Competitor Intel', icon: 'mdi-eye', action: 'competitor-intel' }
    ]
  },
  'risk assessment': {
    text: 'Current risk level: LOW. I\'ve identified 2 minor risks: 1) Customer concentration (top 3 clients = 45% revenue), 2) Tech debt in legacy systems. Both are manageable with proper planning.',
    actions: [
      { label: 'Risk Matrix', icon: 'mdi-shield-alert', action: 'risk-matrix' },
      { label: 'Mitigation Plan', icon: 'mdi-shield-check', action: 'mitigation-plan' }
    ]
  }
}

const sendMessage = () => {
  if (!currentMessage.value.trim()) return
  
  // Add user message
  messages.value.push({
    type: 'user',
    text: currentMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  const userMsg = currentMessage.value.toLowerCase()
  currentMessage.value = ''
  
  // Show typing indicator
  isTyping.value = true
  messages.value.push({
    type: 'ai',
    typing: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  // Simulate AI response
  setTimeout(() => {
    messages.value.pop() // Remove typing indicator
    
    let response = aiResponses[userMsg] || {
      text: 'I understand your query. Based on current data analysis, I recommend reviewing the dashboard metrics for detailed insights. Would you like me to generate a specific report?',
      actions: [
        { label: 'Generate Report', icon: 'mdi-file-document', action: 'generate-report' },
        { label: 'More Options', icon: 'mdi-dots-horizontal', action: 'more-options' }
      ]
    }
    
    messages.value.push({
      type: 'ai',
      text: response.text,
      actions: response.actions,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    
    isTyping.value = false
    scrollToBottom()
  }, 2000)
  
  scrollToBottom()
}

const sendQuickMessage = (text) => {
  currentMessage.value = text
  sendMessage()
}

const executeAction = (action) => {
  messages.value.push({
    type: 'user',
    text: `Execute: ${action.label}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  setTimeout(() => {
    messages.value.push({
      type: 'ai',
      text: `${action.label} executed successfully. The results have been processed and are ready for your review.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    scrollToBottom()
  }, 1000)
  
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesArea.value) {
      messagesArea.value.scrollTop = messagesArea.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.ai-assistant {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.ai-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-core {
  width: 16px;
  height: 16px;
  background: linear-gradient(45deg, #1A237E, #3F51B5);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.ai-ring {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid #1A237E;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 3s linear infinite;
}

.chat-container {
  height: 500px;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 16px;
}

.message {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message-avatar {
  margin-right: 8px;
  margin-top: 4px;
}

.ai-mini-avatar {
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #1A237E, #3F51B5);
  border-radius: 50%;
  position: relative;
}

.ai-mini-avatar::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 1px solid #1A237E;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 2s linear infinite;
}

.message-content {
  max-width: 80%;
}

.message.user .message-content {
  text-align: right;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.message-bubble.ai {
  background: linear-gradient(135deg, rgba(26,35,126,0.1), rgba(63,81,181,0.1));
  border: 1px solid rgba(26,35,126,0.2);
}

.message-bubble.user {
  background: linear-gradient(135deg, #1A237E, #3F51B5);
  color: white;
}

.message-time {
  font-size: 11px;
  color: rgba(0,0,0,0.6);
  margin-top: 4px;
}

.ai-response .response-header {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #1A237E;
  margin-bottom: 8px;
}

.response-text {
  line-height: 1.5;
  margin-bottom: 8px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #1A237E;
  border-radius: 50%;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.input-area {
  border-top: 1px solid rgba(0,0,0,0.1);
  padding-top: 16px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}
</style>
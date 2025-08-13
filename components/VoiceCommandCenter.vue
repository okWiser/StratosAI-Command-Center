<template>
  <v-card class="executive-card voice-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon class="mr-2" :color="isListening ? 'error' : 'primary'">
        {{ isListening ? 'mdi-microphone' : 'mdi-microphone-off' }}
      </v-icon>
      AI Voice Assistant
      <v-spacer />
      <v-btn 
        :color="isListening ? 'error' : 'primary'"
        :variant="isListening ? 'elevated' : 'outlined'"
        @click="toggleListening"
        size="small"
      >
        {{ isListening ? 'Stop' : 'Start' }} Listening
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <div class="voice-visualizer mb-4">
        <div class="waveform">
          <div 
            v-for="i in 20" 
            :key="i"
            class="wave-bar"
            :style="getWaveBarStyle(i)"
          ></div>
        </div>
        
        <div v-if="isListening" class="listening-indicator">
          <div class="pulse-ring"></div>
          <v-icon size="32" color="error">mdi-microphone</v-icon>
        </div>
      </div>
      
      <div class="command-display mb-4">
        <v-text-field
          v-model="currentCommand"
          label="Voice Command"
          readonly
          variant="outlined"
          :loading="isProcessing"
        >
          <template #append-inner>
            <v-icon v-if="currentCommand" color="success">mdi-check</v-icon>
          </template>
        </v-text-field>
      </div>
      
      <div class="quick-commands mb-4">
        <h4 class="text-subtitle-2 mb-2">Quick Commands</h4>
        <v-chip-group>
          <v-chip 
            v-for="command in quickCommands" 
            :key="command"
            @click="executeCommand(command)"
            variant="outlined"
            size="small"
          >
            {{ command }}
          </v-chip>
        </v-chip-group>
      </div>
      
      <div class="command-history">
        <h4 class="text-subtitle-2 mb-2">Recent Commands</h4>
        <v-list density="compact">
          <v-list-item 
            v-for="(cmd, index) in commandHistory" 
            :key="index"
            class="command-history-item"
          >
            <template #prepend>
              <v-icon :color="cmd.status === 'success' ? 'success' : 'error'" size="16">
                {{ cmd.status === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
              </v-icon>
            </template>
            
            <v-list-item-title class="text-body-2">{{ cmd.command }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ cmd.response }}</v-list-item-subtitle>
            
            <template #append>
              <span class="text-caption">{{ cmd.timestamp }}</span>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const isListening = ref(false)
const isProcessing = ref(false)
const currentCommand = ref('')
const waveAmplitudes = ref(Array(20).fill(0))

const quickCommands = [
  'Show revenue report',
  'Update KPI dashboard',
  'Generate forecast',
  'Export data',
  'Schedule meeting'
]

const commandHistory = ref([
  {
    command: 'Show quarterly revenue',
    response: 'Displaying Q4 revenue: $2.8M (+12.5%)',
    status: 'success',
    timestamp: '2 min ago'
  },
  {
    command: 'Export customer data',
    response: 'Customer data exported successfully',
    status: 'success',
    timestamp: '5 min ago'
  },
  {
    command: 'Update team metrics',
    response: 'Team performance metrics updated',
    status: 'success',
    timestamp: '8 min ago'
  }
])

const getWaveBarStyle = (index) => {
  const amplitude = waveAmplitudes.value[index - 1] || 0
  return {
    height: `${Math.max(4, amplitude * 40)}px`,
    backgroundColor: isListening.value ? '#F44336' : '#1A237E',
    opacity: isListening.value ? 0.8 : 0.3
  }
}

const toggleListening = () => {
  isListening.value = !isListening.value
  
  if (isListening.value) {
    startListening()
  } else {
    stopListening()
  }
}

const startListening = () => {
  // Simulate voice recognition
  currentCommand.value = ''
  
  // Animate wave bars
  const animateWaves = () => {
    if (isListening.value) {
      waveAmplitudes.value = waveAmplitudes.value.map(() => Math.random())
      setTimeout(animateWaves, 100)
    }
  }
  animateWaves()
  
  // Simulate command recognition after 3 seconds
  setTimeout(() => {
    if (isListening.value) {
      const commands = [
        'Show me the revenue dashboard',
        'What are today\'s key metrics?',
        'Generate quarterly report',
        'Update team performance data'
      ]
      currentCommand.value = commands[Math.floor(Math.random() * commands.length)]
      processCommand(currentCommand.value)
    }
  }, 3000)
}

const stopListening = () => {
  waveAmplitudes.value = Array(20).fill(0)
}

const executeCommand = (command) => {
  currentCommand.value = command
  processCommand(command)
}

const processCommand = (command) => {
  isProcessing.value = true
  
  setTimeout(() => {
    const responses = {
      'Show revenue report': 'Revenue report displayed - $2.8M this quarter',
      'Update KPI dashboard': 'KPI dashboard refreshed with latest data',
      'Generate forecast': 'AI forecast generated for next 6 months',
      'Export data': 'Data export completed successfully',
      'Schedule meeting': 'Meeting scheduled for tomorrow at 2 PM'
    }
    
    const response = responses[command] || 'Command executed successfully'
    
    commandHistory.value.unshift({
      command,
      response,
      status: 'success',
      timestamp: 'Just now'
    })
    
    if (commandHistory.value.length > 5) {
      commandHistory.value.pop()
    }
    
    isProcessing.value = false
    isListening.value = false
    
    // Clear command after 3 seconds
    setTimeout(() => {
      currentCommand.value = ''
    }, 3000)
  }, 2000)
}
</script>

<style scoped>
.voice-container {
  height: auto;
}

.voice-visualizer {
  position: relative;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(26,35,126,0.05), rgba(63,81,181,0.05));
  border-radius: 16px;
}

.waveform {
  display: flex;
  align-items: end;
  gap: 3px;
  height: 60px;
}

.wave-bar {
  width: 4px;
  background: #1A237E;
  border-radius: 2px;
  transition: height 0.1s ease, background-color 0.3s ease;
}

.listening-indicator {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid #F44336;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.command-history-item {
  border-left: 3px solid transparent;
  transition: border-color 0.2s;
}

.command-history-item:hover {
  border-left-color: #1A237E;
  background: rgba(26,35,126,0.05);
}
</style>
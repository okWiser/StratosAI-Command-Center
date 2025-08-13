<template>
  <v-card class="executive-card network-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon class="mr-2" color="primary">mdi-lan</v-icon>
      Network Topology
      <v-spacer />
      <v-btn-toggle v-model="viewMode" mandatory variant="outlined" size="small">
        <v-btn value="infrastructure" size="small">Infrastructure</v-btn>
        <v-btn value="traffic" size="small">Traffic</v-btn>
        <v-btn value="security" size="small">Security</v-btn>
      </v-btn-toggle>
    </v-card-title>
    
    <v-card-text>
      <div class="network-canvas" @mousemove="onMouseMove">
        <svg class="topology-svg" viewBox="0 0 800 400">
          <!-- Connection Lines -->
          <g class="connections">
            <path 
              v-for="connection in activeConnections" 
              :key="connection.id"
              :d="connection.path"
              :stroke="getConnectionColor(connection)"
              :stroke-width="getConnectionWidth(connection)"
              fill="none"
              :class="connection.status"
            >
              <animate 
                attributeName="stroke-dasharray" 
                :values="connection.animated ? '0,10;10,0;0,10' : ''"
                dur="2s" 
                repeatCount="indefinite"
              />
            </path>
          </g>
          
          <!-- Network Nodes -->
          <g class="nodes">
            <g 
              v-for="node in networkNodes" 
              :key="node.id"
              :transform="`translate(${node.x}, ${node.y})`"
              @click="selectNode(node)"
              class="network-node"
              :class="node.type"
            >
              <!-- Node Glow -->
              <circle 
                :r="node.size + 10" 
                :fill="getNodeGlow(node)"
                opacity="0.3"
                class="node-glow"
              />
              
              <!-- Main Node -->
              <circle 
                :r="node.size" 
                :fill="getNodeColor(node)"
                :stroke="getNodeBorder(node)"
                stroke-width="2"
                class="node-circle"
              />
              
              <!-- Node Icon -->
              <text 
                :font-size="node.size * 0.8"
                text-anchor="middle"
                dominant-baseline="central"
                fill="white"
                class="node-icon"
              >
                {{ getNodeIcon(node.type) }}
              </text>
              
              <!-- Status Indicator -->
              <circle 
                :cx="node.size * 0.7"
                :cy="-node.size * 0.7"
                r="4"
                :fill="getStatusColor(node.status)"
                class="status-indicator"
              />
              
              <!-- Data Flow Animation -->
              <circle 
                v-if="node.activity > 0.5"
                r="2"
                fill="#00ff00"
                opacity="0.8"
                class="data-pulse"
              >
                <animate attributeName="r" values="2;8;2" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
          
          <!-- Traffic Flow Particles -->
          <g v-if="viewMode === 'traffic'" class="traffic-particles">
            <circle 
              v-for="particle in trafficParticles" 
              :key="particle.id"
              r="2"
              fill="#00ffff"
              opacity="0.8"
            >
              <animateMotion 
                :path="particle.path"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
        
        <!-- Node Details Panel -->
        <v-expand-transition>
          <div v-if="selectedNode" class="node-details" :style="detailsStyle">
            <v-card elevation="8" class="pa-4">
              <div class="d-flex justify-space-between align-center mb-3">
                <h4>{{ selectedNode.name }}</h4>
                <v-btn icon="mdi-close" size="small" variant="text" @click="selectedNode = null" />
              </div>
              
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption">Status</div>
                  <v-chip :color="getStatusColor(selectedNode.status)" size="small" variant="tonal">
                    {{ selectedNode.status }}
                  </v-chip>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption">Load</div>
                  <div class="text-h6">{{ (selectedNode.activity * 100).toFixed(1) }}%</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption">Connections</div>
                  <div class="text-h6">{{ selectedNode.connections }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption">Uptime</div>
                  <div class="text-h6">{{ selectedNode.uptime }}</div>
                </v-col>
              </v-row>
              
              <div class="mt-3">
                <div class="text-caption mb-1">Performance</div>
                <v-progress-linear 
                  :model-value="selectedNode.performance"
                  :color="selectedNode.performance > 80 ? 'success' : selectedNode.performance > 60 ? 'warning' : 'error'"
                  height="6"
                  rounded
                />
              </div>
            </v-card>
          </div>
        </v-expand-transition>
      </div>
      
      <!-- Network Stats -->
      <v-row class="mt-4">
        <v-col cols="3">
          <div class="stat-card">
            <div class="stat-value">{{ networkStats.totalNodes }}</div>
            <div class="stat-label">Total Nodes</div>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="stat-card">
            <div class="stat-value">{{ networkStats.activeConnections }}</div>
            <div class="stat-label">Active Connections</div>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="stat-card">
            <div class="stat-value">{{ networkStats.throughput }}</div>
            <div class="stat-label">Throughput</div>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="stat-card">
            <div class="stat-value">{{ networkStats.latency }}</div>
            <div class="stat-label">Avg Latency</div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const viewMode = ref('infrastructure')
const selectedNode = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const networkNodes = ref([
  { id: 1, name: 'Core Router', type: 'router', x: 400, y: 200, size: 25, status: 'online', activity: 0.8, connections: 12, uptime: '99.9%', performance: 95 },
  { id: 2, name: 'Web Server 1', type: 'server', x: 200, y: 100, size: 20, status: 'online', activity: 0.6, connections: 8, uptime: '99.5%', performance: 87 },
  { id: 3, name: 'Web Server 2', type: 'server', x: 600, y: 100, size: 20, status: 'online', activity: 0.7, connections: 9, uptime: '99.8%', performance: 92 },
  { id: 4, name: 'Database', type: 'database', x: 400, y: 50, size: 22, status: 'online', activity: 0.9, connections: 6, uptime: '100%', performance: 98 },
  { id: 5, name: 'Load Balancer', type: 'balancer', x: 400, y: 350, size: 18, status: 'online', activity: 0.5, connections: 15, uptime: '99.7%', performance: 89 },
  { id: 6, name: 'Firewall', type: 'security', x: 100, y: 200, size: 16, status: 'warning', activity: 0.3, connections: 4, uptime: '98.2%', performance: 76 },
  { id: 7, name: 'CDN Edge', type: 'cdn', x: 700, y: 300, size: 18, status: 'online', activity: 0.4, connections: 7, uptime: '99.9%', performance: 94 }
])

const activeConnections = computed(() => [
  { id: 1, path: 'M 400 200 L 200 100', status: 'active', bandwidth: 0.8, animated: true },
  { id: 2, path: 'M 400 200 L 600 100', status: 'active', bandwidth: 0.7, animated: true },
  { id: 3, path: 'M 400 200 L 400 50', status: 'active', bandwidth: 0.9, animated: true },
  { id: 4, path: 'M 400 200 L 400 350', status: 'active', bandwidth: 0.6, animated: true },
  { id: 5, path: 'M 400 200 L 100 200', status: 'warning', bandwidth: 0.3, animated: false },
  { id: 6, path: 'M 400 200 L 700 300', status: 'active', bandwidth: 0.5, animated: true }
])

const trafficParticles = computed(() => 
  activeConnections.value.filter(c => c.animated).map(c => ({
    id: c.id,
    path: c.path
  }))
)

const networkStats = ref({
  totalNodes: 7,
  activeConnections: 6,
  throughput: '2.4 Gbps',
  latency: '12ms'
})

const detailsStyle = computed(() => ({
  left: mouseX.value + 'px',
  top: mouseY.value + 'px'
}))

const getNodeColor = (node) => {
  const colors = {
    router: '#1A237E',
    server: '#2196F3',
    database: '#4CAF50',
    balancer: '#FF9800',
    security: '#F44336',
    cdn: '#9C27B0'
  }
  return colors[node.type] || '#666'
}

const getNodeGlow = (node) => {
  return getNodeColor(node)
}

const getNodeBorder = (node) => {
  return node.status === 'warning' ? '#FF9800' : node.status === 'error' ? '#F44336' : '#FFF'
}

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

const getConnectionColor = (connection) => {
  const colors = {
    active: '#00ff00',
    warning: '#ff9800',
    error: '#ff0000'
  }
  return colors[connection.status] || '#666'
}

const getConnectionWidth = (connection) => {
  return Math.max(1, connection.bandwidth * 4)
}

const selectNode = (node) => {
  selectedNode.value = selectedNode.value?.id === node.id ? null : node
}

const onMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

// Simulate real-time updates
onMounted(() => {
  setInterval(() => {
    networkNodes.value.forEach(node => {
      node.activity = Math.max(0.1, Math.min(1, node.activity + (Math.random() - 0.5) * 0.1))
    })
  }, 2000)
})
</script>

<style scoped>
.network-container {
  height: 600px;
}

.network-canvas {
  height: 400px;
  position: relative;
  background: 
    radial-gradient(circle at 20% 20%, rgba(26,35,126,0.1), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(33,150,243,0.1), transparent 40%);
  border-radius: 12px;
  overflow: hidden;
}

.topology-svg {
  width: 100%;
  height: 100%;
}

.network-node {
  cursor: pointer;
  transition: all 0.3s ease;
}

.network-node:hover .node-circle {
  stroke-width: 3;
}

.network-node:hover .node-glow {
  opacity: 0.6;
}

.node-details {
  position: absolute;
  z-index: 100;
  max-width: 300px;
  pointer-events: none;
}

.node-details .v-card {
  pointer-events: all;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: rgba(26,35,126,0.05);
  border-radius: 8px;
  border: 1px solid rgba(26,35,126,0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1A237E;
  font-family: 'Playfair Display';
}

.stat-label {
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  margin-top: 4px;
}

.connections path.active {
  filter: drop-shadow(0 0 4px currentColor);
}

.connections path.warning {
  filter: drop-shadow(0 0 4px #ff9800);
}

.data-pulse {
  filter: drop-shadow(0 0 4px #00ff00);
}

.status-indicator {
  filter: drop-shadow(0 0 2px currentColor);
}
</style>
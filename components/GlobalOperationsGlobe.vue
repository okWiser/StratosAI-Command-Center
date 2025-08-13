<template>
  <v-card class="executive-card globe-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon class="mr-2" color="primary">mdi-earth</v-icon>
      Global Operations Command
      <v-spacer />
      <v-btn-toggle v-model="viewMode" mandatory variant="outlined" size="small" class="mr-3">
        <v-btn value="offices" size="small">Offices</v-btn>
        <v-btn value="traffic" size="small">Traffic</v-btn>
        <v-btn value="revenue" size="small">Revenue</v-btn>
      </v-btn-toggle>
      <v-chip :color="getGlobalStatusColor()" variant="tonal" size="small">
        {{ activeRegions }} Active • {{ totalEmployees }} Staff
      </v-chip>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <div class="globe-stage" @mousemove="onMouseMove" @mouseleave="resetRotation">
        <!-- 3D Globe with Earth Texture -->
        <div class="globe-sphere" :style="globeStyle">
          <!-- Continental Outlines -->
          <div class="continent north-america"></div>
          <div class="continent europe"></div>
          <div class="continent asia"></div>
          <div class="continent africa"></div>
          <div class="continent south-america"></div>
          <div class="continent oceania"></div>
          
          <!-- Regional Offices -->
          <div 
            v-for="office in regionalOffices" 
            :key="office.id"
            class="regional-office"
            :style="getOfficeStyle(office)"
            @click="selectOffice(office)"
          >
            <div class="office-beacon" :class="office.tier"></div>
            <div class="office-pulse"></div>
            <div class="office-label">{{ office.city }}</div>
          </div>
          
          <!-- Data Connections -->
          <svg class="connection-overlay" viewBox="0 0 400 400">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <g v-if="viewMode === 'traffic'">
              <path 
                v-for="connection in activeConnections" 
                :key="connection.id"
                :d="connection.path"
                :stroke="getConnectionColor(connection.bandwidth)"
                :stroke-width="getConnectionWidth(connection.bandwidth)"
                fill="none"
                filter="url(#glow)"
                class="data-connection"
              >
                <animate 
                  attributeName="stroke-dasharray" 
                  values="0,20;20,0;0,20" 
                  dur="2s" 
                  repeatCount="indefinite"
                />
              </path>
            </g>
            
            <!-- Traffic Particles -->
            <g v-if="viewMode === 'traffic'">
              <circle 
                v-for="particle in trafficParticles" 
                :key="particle.id"
                r="2"
                :fill="particle.color"
                class="traffic-particle"
              >
                <animateMotion 
                  :path="particle.path"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
        </div>
        
        <!-- Office Details Panel -->
        <v-expand-transition>
          <div v-if="selectedOffice" class="office-details" :style="detailsStyle">
            <v-card elevation="12" class="pa-4" style="min-width: 320px;">
              <div class="d-flex justify-space-between align-center mb-3">
                <div>
                  <h4 class="text-h6 font-weight-bold">{{ selectedOffice.city }}</h4>
                  <div class="text-caption text-uppercase">{{ selectedOffice.region }} • {{ selectedOffice.tier }} Office</div>
                </div>
                <v-btn icon="mdi-close" size="small" variant="text" @click="selectedOffice = null" />
              </div>
              
              <v-row dense class="mb-3">
                <v-col cols="6">
                  <div class="metric-small">
                    <div class="metric-value">{{ selectedOffice.employees }}</div>
                    <div class="metric-label">Employees</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="metric-small">
                    <div class="metric-value">{{ formatCurrency(selectedOffice.revenue) }}</div>
                    <div class="metric-label">Revenue</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="metric-small">
                    <div class="metric-value">{{ selectedOffice.growth }}%</div>
                    <div class="metric-label">Growth</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="metric-small">
                    <div class="metric-value">{{ selectedOffice.uptime }}%</div>
                    <div class="metric-label">Uptime</div>
                  </div>
                </v-col>
              </v-row>
              
              <div class="office-actions">
                <v-btn size="small" variant="outlined" color="primary" class="mr-2" @click="openOfficeDetails">
                  <v-icon start size="16">mdi-office-building</v-icon>
                  Office Details
                </v-btn>
                <v-btn size="small" variant="outlined" color="secondary" @click="contactOffice">
                  <v-icon start size="16">mdi-phone</v-icon>
                  Contact
                </v-btn>
              </div>
            </v-card>
          </div>
        </v-expand-transition>
      </div>
      
      <!-- Regional Statistics -->
      <div class="regional-stats pa-4">
        <v-row>
          <v-col v-for="region in regionStats" :key="region.name" cols="4">
            <div class="stat-card" @click="focusRegion(region)">
              <div class="stat-value">{{ formatCurrency(region.revenue) }}</div>
              <div class="stat-label">{{ region.name }}</div>
              <div class="stat-growth" :class="region.growth > 0 ? 'positive' : 'negative'">
                {{ region.growth > 0 ? '+' : '' }}{{ region.growth }}%
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const viewMode = ref('offices')
const mouseX = ref(0)
const mouseY = ref(0)
const selectedOffice = ref(null)
const rotationX = ref(0)
const rotationY = ref(0)
const autoRotation = ref(0)

const regionalOffices = [
  { 
    id: 1, city: 'New York', region: 'Americas', tier: 'headquarters',
    x: 25, y: 35, employees: 2847, revenue: 125000000, growth: 23.5, uptime: 99.9,
    connections: ['london', 'tokyo', 'singapore']
  },
  { 
    id: 2, city: 'London', region: 'EMEA', tier: 'regional',
    x: 50, y: 25, employees: 1456, revenue: 89000000, growth: 18.2, uptime: 99.7,
    connections: ['newyork', 'dubai', 'frankfurt']
  },
  { 
    id: 3, city: 'Tokyo', region: 'APAC', tier: 'regional',
    x: 82, y: 38, employees: 1823, revenue: 94000000, growth: 31.8, uptime: 99.8,
    connections: ['singapore', 'sydney', 'newyork']
  },
  { 
    id: 4, city: 'Singapore', region: 'APAC', tier: 'branch',
    x: 78, y: 52, employees: 892, revenue: 45000000, growth: 28.4, uptime: 99.5,
    connections: ['tokyo', 'sydney', 'mumbai']
  },
  { 
    id: 5, city: 'Dubai', region: 'EMEA', tier: 'branch',
    x: 58, y: 42, employees: 634, revenue: 38000000, growth: 15.7, uptime: 99.3,
    connections: ['london', 'mumbai', 'singapore']
  },
  { 
    id: 6, city: 'São Paulo', region: 'Americas', tier: 'branch',
    x: 32, y: 68, employees: 567, revenue: 32000000, growth: 22.1, uptime: 99.1,
    connections: ['newyork', 'mexico']
  },
  { 
    id: 7, city: 'Sydney', region: 'APAC', tier: 'branch',
    x: 88, y: 78, employees: 423, revenue: 28000000, growth: 19.3, uptime: 99.4,
    connections: ['singapore', 'tokyo']
  }
]

const regionStats = [
  { name: 'Americas', revenue: 157000000, growth: 23.1, offices: 2 },
  { name: 'EMEA', revenue: 127000000, growth: 17.4, offices: 2 },
  { name: 'APAC', revenue: 167000000, growth: 26.8, offices: 3 }
]

const activeConnections = computed(() => {
  return [
    { id: 1, from: 'newyork', to: 'london', path: 'M 100 140 Q 200 100 200 100', bandwidth: 0.9 },
    { id: 2, from: 'newyork', to: 'tokyo', path: 'M 100 140 Q 200 120 328 152', bandwidth: 0.8 },
    { id: 3, from: 'london', to: 'dubai', path: 'M 200 100 Q 250 120 232 168', bandwidth: 0.7 },
    { id: 4, from: 'tokyo', to: 'singapore', path: 'M 328 152 Q 320 180 312 208', bandwidth: 0.6 },
    { id: 5, from: 'singapore', to: 'sydney', path: 'M 312 208 Q 340 240 352 312', bandwidth: 0.5 }
  ]
})

const trafficParticles = computed(() => 
  activeConnections.value.map(conn => ({
    id: conn.id,
    path: conn.path,
    color: getConnectionColor(conn.bandwidth)
  }))
)

const activeRegions = computed(() => regionalOffices.length)
const totalEmployees = computed(() => regionalOffices.reduce((sum, office) => sum + office.employees, 0))

const globeStyle = computed(() => ({
  transform: `rotateX(${rotationX.value}deg) rotateY(${rotationY.value}deg)`
}))

const tooltipStyle = computed(() => ({
  left: mouseX.value + 'px',
  top: mouseY.value + 'px'
}))

const onMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
  
  rotationX.value = (mouseY.value - rect.height / 2) * 0.1
  rotationY.value = (mouseX.value - rect.width / 2) * 0.1
}

const detailsStyle = computed(() => ({
  left: Math.min(mouseX.value + 20, window.innerWidth - 350) + 'px',
  top: Math.min(mouseY.value - 100, window.innerHeight - 300) + 'px'
}))

const selectOffice = (office) => {
  selectedOffice.value = selectedOffice.value?.id === office.id ? null : office
}

const { mockActions } = useMockActions()

const openOfficeDetails = () => {
  mockActions.openOfficeDetails(selectedOffice.value)
}

const contactOffice = () => {
  mockActions.contactOffice(selectedOffice.value)
}

const focusRegion = (region) => {
  mockActions.updateMarketData()
}

const getGlobalStatusColor = () => {
  const avgUptime = regionalOffices.reduce((sum, office) => sum + office.uptime, 0) / regionalOffices.length
  return avgUptime > 99.5 ? 'success' : avgUptime > 99 ? 'warning' : 'error'
}

const getOfficeStyle = (office) => ({
  left: `${office.x}%`,
  top: `${office.y}%`,
  transform: 'translate(-50%, -50%)'
})

const getConnectionColor = (bandwidth) => {
  if (bandwidth > 0.8) return '#10B981'
  if (bandwidth > 0.6) return '#F59E0B'
  return '#EF4444'
}

const getConnectionWidth = (bandwidth) => Math.max(1, bandwidth * 4)

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact'
}).format(value)
</script>

<style scoped>
.globe-container {
  height: 500px;
  overflow: hidden;
}

.globe-stage {
  position: relative;
  height: 350px;
  perspective: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.globe-sphere {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  position: relative;
  transition: transform 0.4s ease;
  background: 
    radial-gradient(circle at 30% 30%, #1e40af, #1e3a8a, #0f172a),
    radial-gradient(circle at 70% 70%, #0369a1, #0c4a6e, #082f49);
  box-shadow: 
    inset -30px -30px 60px rgba(0,0,0,0.4),
    inset 20px 20px 40px rgba(59,130,246,0.1),
    0 30px 60px rgba(0,0,0,0.3),
    0 0 100px rgba(212,175,55,0.2);
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent 60%);
    pointer-events: none;
  }
}

// Continental Outlines
.continent {
  position: absolute;
  border: 1px solid rgba(212,175,55,0.3);
  background: rgba(212,175,55,0.1);
  pointer-events: none;
}

.north-america {
  width: 60px;
  height: 80px;
  top: 20%;
  left: 15%;
  border-radius: 30px 20px 40px 25px;
  transform: rotate(-10deg);
}

.europe {
  width: 40px;
  height: 50px;
  top: 25%;
  left: 48%;
  border-radius: 20px 15px 25px 20px;
}

.asia {
  width: 80px;
  height: 70px;
  top: 20%;
  left: 55%;
  border-radius: 40px 30px 35px 25px;
  transform: rotate(5deg);
}

.africa {
  width: 45px;
  height: 70px;
  top: 35%;
  left: 48%;
  border-radius: 25px 20px 30px 25px;
}

.south-america {
  width: 35px;
  height: 80px;
  top: 50%;
  left: 25%;
  border-radius: 20px 15px 25px 30px;
  transform: rotate(-5deg);
}

.oceania {
  width: 30px;
  height: 25px;
  top: 70%;
  left: 75%;
  border-radius: 15px;
}

// Regional Offices
.regional-office {
  position: absolute;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.office-beacon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  z-index: 3;
  
  &.headquarters {
    background: linear-gradient(135deg, #D4AF37, #F59E0B);
    box-shadow: 0 0 20px #D4AF37;
    width: 20px;
    height: 20px;
  }
  
  &.regional {
    background: linear-gradient(135deg, #10B981, #059669);
    box-shadow: 0 0 15px #10B981;
    width: 16px;
    height: 16px;
  }
  
  &.branch {
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    box-shadow: 0 0 12px #3B82F6;
    width: 12px;
    height: 12px;
  }
}

.office-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid rgba(212,175,55,0.6);
  border-radius: 50%;
  animation: officePulse 3s ease-in-out infinite;
  z-index: 1;
}

.office-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: var(--theme-text);
  background: var(--theme-glass);
  padding: 2px 6px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212,175,55,0.2);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 4;
}

.regional-office:hover .office-label {
  opacity: 1;
}

.connection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.data-connection {
  opacity: 0.8;
  filter: drop-shadow(0 0 4px currentColor);
}

.traffic-particle {
  filter: drop-shadow(0 0 3px currentColor);
}

@keyframes officePulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(0.8); 
    opacity: 1; 
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.5); 
    opacity: 0.3; 
  }
}

.office-details {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  
  .v-card {
    pointer-events: all;
    background: var(--theme-glass);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(212,175,55,0.3);
  }
}

.metric-small {
  text-align: center;
  padding: 8px;
  background: rgba(var(--theme-primary), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--theme-primary), 0.1);
}

.metric-small .metric-value {
  font-size: 16px;
  font-weight: bold;
  color: var(--theme-text);
}

.metric-small .metric-label {
  font-size: 10px;
  color: var(--theme-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.office-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.regional-stats {
  border-top: 1px solid rgba(var(--theme-primary), 0.1);
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: var(--theme-glass);
  border-radius: 12px;
  border: 1px solid rgba(212,175,55,0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212,175,55,0.2);
    border-color: rgba(212,175,55,0.4);
  }
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--theme-text);
  font-family: 'Playfair Display';
}

.stat-label {
  font-size: 12px;
  color: var(--theme-textSecondary);
  margin-top: 4px;
}

.stat-growth {
  font-size: 11px;
  font-weight: 600;
  margin-top: 2px;
  
  &.positive {
    color: #10B981;
  }
  
  &.negative {
    color: #EF4444;
  }
}
</style>
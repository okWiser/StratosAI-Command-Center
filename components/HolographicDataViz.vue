<template>
  <v-card class="executive-card hologram-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon class="mr-2" color="primary">mdi-cube-outline</v-icon>
      Holographic Analytics
      <v-spacer />
      <v-btn-toggle v-model="selectedDataset" mandatory variant="outlined" size="small">
        <v-btn value="revenue" size="small">Revenue</v-btn>
        <v-btn value="users" size="small">Users</v-btn>
        <v-btn value="performance" size="small">Performance</v-btn>
      </v-btn-toggle>
    </v-card-title>
    
    <v-card-text>
      <div class="hologram-stage" @mousemove="onMouseMove" @mouseleave="resetRotation">
        <div class="hologram-grid" :style="gridStyle">
          <!-- 3D Data Bars -->
          <div 
            v-for="(bar, index) in currentDataBars" 
            :key="index"
            class="data-bar"
            :style="getBarStyle(bar, index)"
            @click="selectBar(bar, index)"
          >
            <div class="bar-glow"></div>
            <div class="bar-value">{{ bar.value }}</div>
          </div>
          
          <!-- Floating Data Points -->
          <div 
            v-for="(point, index) in floatingPoints" 
            :key="`point-${index}`"
            class="floating-point"
            :style="getPointStyle(point, index)"
          >
            <div class="point-pulse"></div>
          </div>
          
          <!-- Holographic Planes -->
          <div class="holo-plane plane-1"></div>
          <div class="holo-plane plane-2"></div>
          <div class="holo-plane plane-3"></div>
        </div>
        
        <div v-if="selectedBar" class="data-tooltip" :style="tooltipStyle">
          <h4>{{ selectedBar.label }}</h4>
          <p>Value: {{ selectedBar.value }}</p>
          <p>Growth: +{{ selectedBar.growth }}%</p>
          <p>Trend: {{ selectedBar.trend }}</p>
        </div>
      </div>
      
      <div class="hologram-controls mt-4">
        <v-row>
          <v-col cols="4">
            <div class="control-panel">
              <div class="text-caption mb-1">Rotation Speed</div>
              <v-slider v-model="rotationSpeed" min="0" max="5" step="0.5" hide-details />
            </div>
          </v-col>
          <v-col cols="4">
            <div class="control-panel">
              <div class="text-caption mb-1">Data Intensity</div>
              <v-slider v-model="dataIntensity" min="0.5" max="2" step="0.1" hide-details />
            </div>
          </v-col>
          <v-col cols="4">
            <div class="control-panel">
              <div class="text-caption mb-1">Hologram Opacity</div>
              <v-slider v-model="holoOpacity" min="0.3" max="1" step="0.1" hide-details />
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const selectedDataset = ref('revenue')
const selectedBar = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const rotationSpeed = ref(1)
const dataIntensity = ref(1)
const holoOpacity = ref(0.8)
const autoRotation = ref(0)

const datasets = {
  revenue: [
    { label: 'Q1', value: '2.1M', growth: 12, trend: 'up', height: 60 },
    { label: 'Q2', value: '2.8M', growth: 33, trend: 'up', height: 80 },
    { label: 'Q3', value: '3.2M', growth: 14, trend: 'up', height: 90 },
    { label: 'Q4', value: '3.8M', growth: 19, trend: 'up', height: 100 }
  ],
  users: [
    { label: 'Jan', value: '15K', growth: 8, trend: 'up', height: 45 },
    { label: 'Feb', value: '18K', growth: 20, trend: 'up', height: 65 },
    { label: 'Mar', value: '22K', growth: 22, trend: 'up', height: 85 },
    { label: 'Apr', value: '28K', growth: 27, trend: 'up', height: 95 }
  ],
  performance: [
    { label: 'Speed', value: '94%', growth: 5, trend: 'up', height: 75 },
    { label: 'Uptime', value: '99.9%', growth: 2, trend: 'stable', height: 98 },
    { label: 'Quality', value: '96%', growth: 8, trend: 'up', height: 82 },
    { label: 'Satisfaction', value: '92%', growth: 12, trend: 'up', height: 88 }
  ]
}

const floatingPoints = Array.from({ length: 12 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 100,
  size: Math.random() * 8 + 4
}))

const currentDataBars = computed(() => datasets[selectedDataset.value])

const gridStyle = computed(() => ({
  transform: `rotateX(${mouseY.value * 0.1}deg) rotateY(${mouseX.value * 0.1 + autoRotation.value}deg)`,
  opacity: holoOpacity.value
}))

const tooltipStyle = computed(() => ({
  left: mouseX.value + 'px',
  top: mouseY.value + 'px'
}))

const getBarStyle = (bar, index) => ({
  height: `${bar.height * dataIntensity.value}px`,
  left: `${20 + index * 20}%`,
  animationDelay: `${index * 0.2}s`
})

const getPointStyle = (point, index) => ({
  left: `${point.x}%`,
  top: `${point.y}%`,
  width: `${point.size}px`,
  height: `${point.size}px`,
  animationDelay: `${index * 0.3}s`
})

const onMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width - 0.5) * 60
  mouseY.value = ((e.clientY - rect.top) / rect.height - 0.5) * -60
}

const resetRotation = () => {
  mouseX.value = 0
  mouseY.value = 0
}

const selectBar = (bar, index) => {
  selectedBar.value = selectedBar.value?.label === bar.label ? null : bar
}

// Auto rotation animation
let rotationInterval
onMounted(() => {
  rotationInterval = setInterval(() => {
    autoRotation.value += rotationSpeed.value * 0.5
  }, 50)
})

onUnmounted(() => {
  if (rotationInterval) clearInterval(rotationInterval)
})
</script>

<style scoped>
.hologram-container {
  height: 500px;
  background: radial-gradient(circle at center, rgba(26,35,126,0.1), rgba(0,0,0,0.05));
  border: 1px solid rgba(0,255,255,0.3);
}

.hologram-stage {
  height: 350px;
  perspective: 1000px;
  position: relative;
  overflow: hidden;
  background: 
    radial-gradient(circle at 30% 30%, rgba(0,255,255,0.1), transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255,0,255,0.1), transparent 50%);
}

.hologram-grid {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.data-bar {
  position: absolute;
  width: 40px;
  background: linear-gradient(to top, #00ffff, #0080ff);
  border-radius: 4px;
  bottom: 20%;
  cursor: pointer;
  transform-style: preserve-3d;
  animation: barGlow 2s ease-in-out infinite alternate;
  box-shadow: 0 0 20px rgba(0,255,255,0.5);
}

.bar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: inherit;
  filter: blur(10px);
  opacity: 0.6;
  z-index: -1;
}

.bar-value {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ffff;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 0 10px currentColor;
}

.floating-point {
  position: absolute;
  background: radial-gradient(circle, #ff00ff, transparent);
  border-radius: 50%;
  animation: float3D 4s ease-in-out infinite;
}

.point-pulse {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: inherit;
  animation: pulse3D 2s ease-in-out infinite;
}

.holo-plane {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(0,255,255,0.3);
  background: linear-gradient(45deg, 
    rgba(0,255,255,0.1), 
    rgba(255,0,255,0.1), 
    rgba(0,255,255,0.1)
  );
}

.plane-1 {
  top: 10%;
  left: 10%;
  transform: rotateX(45deg) rotateY(45deg);
  animation: planeFloat1 6s ease-in-out infinite;
}

.plane-2 {
  top: 30%;
  right: 10%;
  transform: rotateX(-30deg) rotateY(-45deg);
  animation: planeFloat2 8s ease-in-out infinite;
}

.plane-3 {
  bottom: 10%;
  left: 30%;
  transform: rotateX(60deg) rotateY(30deg);
  animation: planeFloat3 10s ease-in-out infinite;
}

.data-tooltip {
  position: absolute;
  background: rgba(0,0,0,0.9);
  color: #00ffff;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
  border: 1px solid rgba(0,255,255,0.5);
  box-shadow: 0 0 20px rgba(0,255,255,0.3);
}

.control-panel {
  background: rgba(0,255,255,0.1);
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(0,255,255,0.3);
}

@keyframes barGlow {
  0% { box-shadow: 0 0 20px rgba(0,255,255,0.5); }
  100% { box-shadow: 0 0 40px rgba(0,255,255,0.8), 0 0 60px rgba(0,255,255,0.4); }
}

@keyframes float3D {
  0%, 100% { transform: translateZ(0px) rotateY(0deg); }
  50% { transform: translateZ(30px) rotateY(180deg); }
}

@keyframes pulse3D {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}

@keyframes planeFloat1 {
  0%, 100% { transform: rotateX(45deg) rotateY(45deg) translateZ(0px); }
  50% { transform: rotateX(45deg) rotateY(45deg) translateZ(20px); }
}

@keyframes planeFloat2 {
  0%, 100% { transform: rotateX(-30deg) rotateY(-45deg) translateZ(0px); }
  50% { transform: rotateX(-30deg) rotateY(-45deg) translateZ(-15px); }
}

@keyframes planeFloat3 {
  0%, 100% { transform: rotateX(60deg) rotateY(30deg) translateZ(0px); }
  50% { transform: rotateX(60deg) rotateY(30deg) translateZ(25px); }
}
</style>
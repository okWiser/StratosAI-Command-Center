<template>
  <v-card class="executive-card globe-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon class="mr-2" color="primary">mdi-earth</v-icon>
      Global Operations
      <v-spacer />
      <v-chip color="success" variant="tonal" size="small">
        {{ activeRegions }} Active Regions
      </v-chip>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <div class="globe-wrapper" @mousemove="onMouseMove">
        <div class="globe" :style="globeStyle">
          <div 
            v-for="location in locations" 
            :key="location.id"
            class="location-pin"
            :style="getPinStyle(location)"
            @click="selectLocation(location)"
          >
            <div class="pulse-ring"></div>
            <div class="location-dot" :class="location.status"></div>
          </div>
        </div>
        
        <div v-if="selectedLocation" class="location-tooltip" :style="tooltipStyle">
          <h4>{{ selectedLocation.city }}</h4>
          <p>Revenue: {{ formatCurrency(selectedLocation.revenue) }}</p>
          <p>Growth: +{{ selectedLocation.growth }}%</p>
          <p>Status: {{ selectedLocation.status }}</p>
        </div>
      </div>
      
      <v-row class="pa-4">
        <v-col v-for="region in regionStats" :key="region.name" cols="4">
          <div class="text-center">
            <div class="text-h6 font-weight-bold">{{ formatCurrency(region.revenue) }}</div>
            <div class="text-caption">{{ region.name }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const mouseX = ref(0)
const mouseY = ref(0)
const selectedLocation = ref(null)
const rotationX = ref(0)
const rotationY = ref(0)

const locations = [
  { id: 1, city: 'New York', x: 30, y: 25, revenue: 8500000, growth: 12.5, status: 'active' },
  { id: 2, city: 'London', x: 50, y: 20, revenue: 6200000, growth: 8.3, status: 'active' },
  { id: 3, city: 'Tokyo', x: 85, y: 35, revenue: 7800000, growth: 15.2, status: 'active' },
  { id: 4, city: 'Sydney', x: 88, y: 75, revenue: 3400000, growth: 6.8, status: 'warning' },
  { id: 5, city: 'São Paulo', x: 25, y: 65, revenue: 4100000, growth: 18.7, status: 'active' }
]

const regionStats = [
  { name: 'Americas', revenue: 12600000 },
  { name: 'EMEA', revenue: 9800000 },
  { name: 'APAC', revenue: 11200000 }
]

const activeRegions = computed(() => locations.filter(l => l.status === 'active').length)

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

const getPinStyle = (location) => ({
  left: location.x + '%',
  top: location.y + '%'
})

const selectLocation = (location) => {
  selectedLocation.value = selectedLocation.value?.id === location.id ? null : location
}

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact'
}).format(value)
</script>

<style scoped>
.globe-container {
  height: 400px;
  overflow: hidden;
}

.globe-wrapper {
  position: relative;
  height: 300px;
  perspective: 1000px;
}

.globe {
  width: 280px;
  height: 280px;
  margin: 10px auto;
  background: radial-gradient(circle at 30% 30%, #4FC3F7, #1976D2, #0D47A1);
  border-radius: 50%;
  position: relative;
  transition: transform 0.3s ease;
  box-shadow: 
    inset -20px -20px 50px rgba(0,0,0,0.3),
    0 20px 40px rgba(0,0,0,0.2);
}

.location-pin {
  position: absolute;
  cursor: pointer;
  z-index: 10;
}

.location-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.location-dot.active {
  background: #4CAF50;
  box-shadow: 0 0 10px #4CAF50;
}

.location-dot.warning {
  background: #FF9800;
  box-shadow: 0 0 10px #FF9800;
}

.pulse-ring {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #4CAF50;
  border-radius: 50%;
  top: -4px;
  left: -4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.location-tooltip {
  position: absolute;
  background: rgba(0,0,0,0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
  backdrop-filter: blur(10px);
}
</style>
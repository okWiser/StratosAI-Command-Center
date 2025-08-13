<template>
  <v-card class="executive-card radar-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
      Team Performance Matrix
      <v-spacer />
      <v-btn-toggle v-model="selectedTeam" mandatory variant="outlined" size="small">
        <v-btn v-for="team in teams" :key="team.id" :value="team.id" size="small">
          {{ team.name }}
        </v-btn>
      </v-btn-toggle>
    </v-card-title>
    
    <v-card-text>
      <div class="radar-wrapper">
        <svg class="radar-chart" viewBox="0 0 400 400">
          <!-- Grid -->
          <g class="grid">
            <circle v-for="i in 5" :key="i" 
              :r="i * 30" 
              cx="200" cy="200" 
              fill="none" 
              stroke="rgba(26,35,126,0.1)" 
              stroke-width="1"
            />
            <line v-for="(metric, index) in metrics" :key="index"
              :x1="200" :y1="200"
              :x2="200 + Math.cos(getAngle(index)) * 150"
              :y2="200 + Math.sin(getAngle(index)) * 150"
              stroke="rgba(26,35,126,0.1)"
              stroke-width="1"
            />
          </g>
          
          <!-- Data polygon -->
          <polygon 
            :points="getPolygonPoints(currentTeamData)"
            fill="rgba(26,35,126,0.2)"
            stroke="#1A237E"
            stroke-width="2"
          />
          
          <!-- Data points -->
          <circle 
            v-for="(value, index) in currentTeamData.values" 
            :key="index"
            :cx="200 + Math.cos(getAngle(index)) * (value * 30)"
            :cy="200 + Math.sin(getAngle(index)) * (value * 30)"
            r="6"
            fill="#FF6B35"
            stroke="white"
            stroke-width="2"
            class="data-point"
            @click="showMetricDetail(index)"
          />
          
          <!-- Labels -->
          <text 
            v-for="(metric, index) in metrics" 
            :key="index"
            :x="200 + Math.cos(getAngle(index)) * 170"
            :y="200 + Math.sin(getAngle(index)) * 170"
            text-anchor="middle"
            dominant-baseline="middle"
            class="metric-label"
          >
            {{ metric }}
          </text>
        </svg>
        
        <div class="team-stats">
          <div class="overall-score">
            <div class="score-circle">
              <span class="score-value">{{ overallScore }}</span>
              <span class="score-label">Overall</span>
            </div>
          </div>
          
          <div class="metric-details">
            <div v-for="(metric, index) in metrics" :key="index" class="metric-item">
              <div class="metric-name">{{ metric }}</div>
              <v-progress-linear 
                :model-value="currentTeamData.values[index] * 20"
                color="primary"
                height="6"
                rounded
              />
              <div class="metric-value">{{ (currentTeamData.values[index] * 20).toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const selectedTeam = ref(1)
const metrics = ['Innovation', 'Efficiency', 'Quality', 'Collaboration', 'Leadership', 'Growth']

const teams = [
  { 
    id: 1, 
    name: 'Engineering', 
    values: [4.8, 4.2, 4.6, 3.9, 4.1, 4.5],
    members: 24,
    lead: 'Sarah Chen'
  },
  { 
    id: 2, 
    name: 'Sales', 
    values: [3.8, 4.7, 4.1, 4.8, 4.3, 4.9],
    members: 18,
    lead: 'Marcus Johnson'
  },
  { 
    id: 3, 
    name: 'Marketing', 
    values: [4.9, 3.8, 4.3, 4.6, 4.2, 4.4],
    members: 12,
    lead: 'Elena Rodriguez'
  }
]

const currentTeamData = computed(() => 
  teams.find(team => team.id === selectedTeam.value) || teams[0]
)

const overallScore = computed(() => {
  const avg = currentTeamData.value.values.reduce((a, b) => a + b, 0) / metrics.length
  return Math.round(avg * 20)
})

const getAngle = (index) => {
  return (index * 2 * Math.PI / metrics.length) - Math.PI / 2
}

const getPolygonPoints = (teamData) => {
  return teamData.values.map((value, index) => {
    const x = 200 + Math.cos(getAngle(index)) * (value * 30)
    const y = 200 + Math.sin(getAngle(index)) * (value * 30)
    return `${x},${y}`
  }).join(' ')
}

const showMetricDetail = (index) => {
  // Could open detailed metric analysis
  console.log(`Showing details for ${metrics[index]}`)
}
</script>

<style scoped>
.radar-container {
  height: 500px;
}

.radar-wrapper {
  display: flex;
  gap: 24px;
  height: 400px;
}

.radar-chart {
  width: 400px;
  height: 400px;
}

.metric-label {
  font-size: 12px;
  font-weight: 600;
  fill: #1A237E;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s;
}

.data-point:hover {
  r: 8;
}

.team-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.overall-score {
  text-align: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1A237E, #3F51B5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  font-family: 'Playfair Display';
}

.score-label {
  font-size: 12px;
  opacity: 0.8;
}

.metric-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-name {
  width: 100px;
  font-size: 12px;
  font-weight: 500;
}

.metric-value {
  width: 50px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
}
</style>
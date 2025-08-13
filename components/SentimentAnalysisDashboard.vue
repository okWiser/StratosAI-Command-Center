<template>
  <v-card class="executive-card sentiment-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold">
      <v-icon class="mr-2" color="primary">mdi-brain</v-icon>
      AI Sentiment Analysis
      <v-spacer />
      <v-chip :color="overallSentimentColor" variant="tonal" size="small">
        {{ overallSentiment }}% Positive
      </v-chip>
    </v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <div class="sentiment-gauge">
            <svg viewBox="0 0 200 120" class="gauge-svg">
              <!-- Background arc -->
              <path d="M 20 100 A 80 80 0 0 1 180 100" 
                stroke="#E0E0E0" 
                stroke-width="20" 
                fill="none"
              />
              
              <!-- Sentiment arc -->
              <path d="M 20 100 A 80 80 0 0 1 180 100" 
                :stroke="sentimentGradient"
                stroke-width="20" 
                fill="none"
                :stroke-dasharray="sentimentArcLength"
                :stroke-dashoffset="sentimentOffset"
                class="sentiment-arc"
              />
              
              <!-- Needle -->
              <line 
                :x1="100" :y1="100"
                :x2="100 + Math.cos(needleAngle) * 70"
                :y2="100 + Math.sin(needleAngle) * 70"
                stroke="#1A237E"
                stroke-width="3"
                stroke-linecap="round"
              />
              <circle cx="100" cy="100" r="8" fill="#1A237E" />
              
              <!-- Value text -->
              <text x="100" y="90" text-anchor="middle" class="gauge-value">
                {{ overallSentiment }}%
              </text>
            </svg>
          </div>
        </v-col>
        
        <v-col cols="12" md="6">
          <div class="sentiment-sources">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Data Sources</h4>
            <div v-for="source in sentimentSources" :key="source.name" class="source-item mb-3">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="source-name">{{ source.name }}</span>
                <v-chip :color="getSentimentColor(source.sentiment)" size="x-small" variant="tonal">
                  {{ source.sentiment }}%
                </v-chip>
              </div>
              <v-progress-linear 
                :model-value="Math.abs(source.sentiment)"
                :color="getSentimentColor(source.sentiment)"
                height="4"
                rounded
              />
              <div class="text-caption mt-1">{{ source.samples }} samples analyzed</div>
            </div>
          </div>
        </v-col>
      </v-row>
      
      <v-divider class="my-4" />
      
      <div class="sentiment-timeline">
        <h4 class="text-subtitle-1 font-weight-bold mb-3">Sentiment Timeline</h4>
        <div class="timeline-container">
          <div 
            v-for="(point, index) in sentimentTimeline" 
            :key="index"
            class="timeline-point"
            :style="getTimelinePointStyle(point, index)"
            @click="showTimelineDetail(point)"
          >
            <div class="timeline-dot" :class="getSentimentClass(point.sentiment)"></div>
            <div class="timeline-label">{{ point.time }}</div>
            <div class="timeline-value">{{ point.sentiment }}%</div>
          </div>
        </div>
      </div>
      
      <v-expand-transition>
        <v-alert v-if="selectedTimelinePoint" 
          :color="getSentimentColor(selectedTimelinePoint.sentiment)"
          variant="tonal"
          class="mt-4"
        >
          <div class="font-weight-bold">{{ selectedTimelinePoint.time }} Analysis</div>
          <div>{{ selectedTimelinePoint.description }}</div>
          <div class="text-caption mt-1">
            Key factors: {{ selectedTimelinePoint.factors.join(', ') }}
          </div>
        </v-alert>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const selectedTimelinePoint = ref(null)

const sentimentSources = [
  { name: 'Customer Reviews', sentiment: 87, samples: 2847 },
  { name: 'Social Media', sentiment: 72, samples: 15632 },
  { name: 'Employee Feedback', sentiment: 91, samples: 456 },
  { name: 'Press Coverage', sentiment: 68, samples: 234 },
  { name: 'Partner Surveys', sentiment: 83, samples: 189 }
]

const sentimentTimeline = [
  { 
    time: '9 AM', 
    sentiment: 85, 
    description: 'Strong positive sentiment from morning customer interactions',
    factors: ['Product launch', 'Customer support', 'Social engagement']
  },
  { 
    time: '12 PM', 
    sentiment: 78, 
    description: 'Slight dip due to service disruption reports',
    factors: ['Service issues', 'Response time', 'Communication']
  },
  { 
    time: '3 PM', 
    sentiment: 82, 
    description: 'Recovery after quick resolution and proactive communication',
    factors: ['Issue resolution', 'Transparency', 'Customer care']
  },
  { 
    time: '6 PM', 
    sentiment: 89, 
    description: 'Peak positive sentiment from successful product demo',
    factors: ['Product demo', 'Feature showcase', 'User engagement']
  }
]

const overallSentiment = computed(() => {
  const avg = sentimentSources.reduce((sum, source) => sum + source.sentiment, 0) / sentimentSources.length
  return Math.round(avg)
})

const overallSentimentColor = computed(() => getSentimentColor(overallSentiment.value))

const sentimentGradient = computed(() => {
  if (overallSentiment.value >= 80) return '#4CAF50'
  if (overallSentiment.value >= 60) return '#FF9800'
  return '#F44336'
})

const needleAngle = computed(() => {
  const percentage = overallSentiment.value / 100
  return Math.PI - (percentage * Math.PI)
})

const sentimentArcLength = computed(() => {
  const circumference = Math.PI * 160
  return `${(overallSentiment.value / 100) * circumference} ${circumference}`
})

const sentimentOffset = computed(() => {
  const circumference = Math.PI * 160
  return circumference - (overallSentiment.value / 100) * circumference
})

const getSentimentColor = (sentiment) => {
  if (sentiment >= 80) return 'success'
  if (sentiment >= 60) return 'warning'
  return 'error'
}

const getSentimentClass = (sentiment) => {
  if (sentiment >= 80) return 'positive'
  if (sentiment >= 60) return 'neutral'
  return 'negative'
}

const getTimelinePointStyle = (point, index) => ({
  left: `${(index / (sentimentTimeline.length - 1)) * 100}%`
})

const showTimelineDetail = (point) => {
  selectedTimelinePoint.value = selectedTimelinePoint.value?.time === point.time ? null : point
}
</script>

<style scoped>
.sentiment-container {
  height: auto;
}

.sentiment-gauge {
  text-align: center;
}

.gauge-svg {
  width: 200px;
  height: 120px;
}

.sentiment-arc {
  transition: stroke-dasharray 1s ease, stroke 0.5s ease;
}

.gauge-value {
  font-size: 18px;
  font-weight: bold;
  fill: #1A237E;
}

.source-item {
  padding: 8px 0;
}

.source-name {
  font-size: 14px;
  font-weight: 500;
}

.timeline-container {
  position: relative;
  height: 80px;
  background: linear-gradient(90deg, #F44336, #FF9800, #4CAF50);
  border-radius: 40px;
  margin: 16px 0;
}

.timeline-point {
  position: absolute;
  cursor: pointer;
  transform: translateX(-50%);
  text-align: center;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 0 auto 4px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.timeline-dot.positive {
  background: #4CAF50;
}

.timeline-dot.neutral {
  background: #FF9800;
}

.timeline-dot.negative {
  background: #F44336;
}

.timeline-label {
  font-size: 12px;
  font-weight: 500;
}

.timeline-value {
  font-size: 10px;
  font-weight: bold;
}
</style>
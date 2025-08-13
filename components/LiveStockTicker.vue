<template>
  <v-card class="executive-card ticker-container" elevation="0">
    <v-card-title class="text-h6 font-weight-bold pb-2">
      <v-icon class="mr-2" color="success">mdi-chart-line</v-icon>
      Market Watch
      <v-spacer />
      <v-chip color="success" variant="tonal" size="small">
        <v-icon start size="16">mdi-pulse</v-icon>
        Live
      </v-chip>
    </v-card-title>
    
    <div class="ticker-wrapper">
      <div class="ticker-content" :style="tickerStyle">
        <div 
          v-for="(stock, index) in [...stocks, ...stocks]" 
          :key="`${stock.symbol}-${index}`"
          class="stock-item"
          @click="selectStock(stock)"
        >
          <span class="symbol">{{ stock.symbol }}</span>
          <span class="price">${{ stock.price.toFixed(2) }}</span>
          <span class="change" :class="stock.change >= 0 ? 'positive' : 'negative'">
            <v-icon size="16">{{ stock.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
          </span>
        </div>
      </div>
    </div>
    
    <v-expand-transition>
      <v-card v-if="selectedStock" class="ma-4 stock-detail" elevation="4">
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="text-h6">{{ selectedStock.name }}</h3>
            <v-btn icon="mdi-close" size="small" variant="text" @click="selectedStock = null" />
          </div>
          
          <v-row>
            <v-col cols="6">
              <div class="text-caption">Current Price</div>
              <div class="text-h5 font-weight-bold">${{ selectedStock.price.toFixed(2) }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">24h Change</div>
              <div class="text-h6" :class="selectedStock.change >= 0 ? 'text-success' : 'text-error'">
                {{ selectedStock.change >= 0 ? '+' : '' }}{{ selectedStock.change.toFixed(2) }}%
              </div>
            </v-col>
          </v-row>
          
          <div class="mini-chart mt-3">
            <svg width="100%" height="60" viewBox="0 0 200 60">
              <path 
                :d="generateSparkline(selectedStock.history)" 
                stroke="#1A237E" 
                stroke-width="2" 
                fill="none"
              />
            </svg>
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
const tickerPosition = ref(0)
const selectedStock = ref(null)

const stocks = ref([
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, history: [170, 172, 175, 173, 175.43] },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.23, change: -1.23, history: [2850, 2845, 2840, 2850, 2847.23] },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 1.87, history: [375, 377, 380, 376, 378.85] },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: 4.56, history: [240, 245, 250, 246, 248.42] },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3247.89, change: -0.89, history: [3250, 3245, 3240, 3250, 3247.89] }
])

const tickerStyle = computed(() => ({
  transform: `translateX(${tickerPosition.value}px)`,
  transition: 'transform 0.1s linear'
}))

const selectStock = (stock) => {
  selectedStock.value = selectedStock.value?.symbol === stock.symbol ? null : stock
}

const generateSparkline = (data) => {
  const width = 200
  const height = 60
  const padding = 10
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  
  return data.map((value, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
    const y = height - padding - ((value - min) / range) * (height - 2 * padding)
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
}

// Animate ticker
let animationFrame
const animateTicker = () => {
  tickerPosition.value -= 1
  if (tickerPosition.value <= -800) {
    tickerPosition.value = 0
  }
  animationFrame = requestAnimationFrame(animateTicker)
}

// Update stock prices
const updatePrices = () => {
  stocks.value.forEach(stock => {
    const change = (Math.random() - 0.5) * 2
    stock.price += change
    stock.change = ((stock.price - stock.history[0]) / stock.history[0]) * 100
    stock.history.push(stock.price)
    if (stock.history.length > 20) stock.history.shift()
  })
}

onMounted(() => {
  animateTicker()
  setInterval(updatePrices, 3000)
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
})
</script>

<style scoped>
.ticker-container {
  height: auto;
  overflow: hidden;
}

.ticker-wrapper {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, rgba(26,35,126,0.05), rgba(26,35,126,0.02), rgba(26,35,126,0.05));
}

.ticker-content {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}

.stock-item {
  display: inline-flex;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-right: 1px solid rgba(0,0,0,0.1);
}

.stock-item:hover {
  background: rgba(26,35,126,0.1);
}

.symbol {
  font-weight: bold;
  margin-right: 12px;
  color: #1A237E;
}

.price {
  margin-right: 12px;
  font-weight: 600;
}

.change {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.positive {
  color: #4CAF50;
}

.negative {
  color: #F44336;
}

.stock-detail {
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,250,250,0.95));
  backdrop-filter: blur(10px);
}

.mini-chart {
  background: rgba(26,35,126,0.05);
  border-radius: 8px;
  padding: 8px;
}
</style>
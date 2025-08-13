<template>
  <v-app-bar elevation="0" class="executive-header" height="80">
    <div class="header-content">
      <!-- Premium Logo Section -->
      <div class="logo-section">
        <div class="stratos-logo">
          <div class="logo-icon">
            <div class="logo-core"></div>
            <div class="logo-ring ring-1"></div>
            <div class="logo-ring ring-2"></div>
            <div class="logo-ring ring-3"></div>
          </div>
          <div class="logo-text">
            <div class="brand-name">StratosAI</div>
            <div class="brand-tagline">Executive Command Center</div>
          </div>
        </div>
      </div>

      <!-- Executive Status Bar -->
      <div class="status-bar">
        <div class="status-item">
          <v-icon size="16" color="success">mdi-shield-check</v-icon>
          <span>Secure</span>
        </div>
        <div class="status-item">
          <div class="pulse-dot success"></div>
          <span>Live Data</span>
        </div>
        <div class="status-item">
          <v-icon size="16" color="primary">mdi-brain</v-icon>
          <span>AI Active</span>
        </div>
        <div class="status-item">
          <v-icon size="16" color="warning">mdi-earth</v-icon>
          <span>Global Ops</span>
        </div>
      </div>

      <!-- Executive Controls -->
      <div class="executive-controls">
        <!-- Theme Toggle -->
        <v-btn 
          @click="toggleTheme"
          icon
          variant="text"
          class="theme-toggle"
          size="large"
        >
          <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
        </v-btn>

        <!-- Executive Notifications -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="notification-btn" size="large">
              <v-badge :content="notifications.length" color="error" offset-x="2" offset-y="2">
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          
          <v-card class="notification-panel" min-width="350">
            <v-card-title class="text-h6 font-weight-bold">
              Executive Alerts
            </v-card-title>
            <v-divider />
            <v-list>
              <v-list-item 
                v-for="notification in notifications" 
                :key="notification.id"
                class="notification-item"
              >
                <template #prepend>
                  <v-icon :color="notification.priority" size="20">{{ notification.icon }}</v-icon>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  {{ notification.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ notification.time }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <!-- Executive Profile -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" class="executive-profile" variant="text">
              <v-avatar size="40" class="executive-avatar">
                <div class="avatar-gradient">
                  <span class="avatar-initials">CEO</span>
                </div>
              </v-avatar>
              <div class="profile-info ml-3">
                <div class="profile-name">Executive User</div>
                <div class="profile-role">Chief Executive Officer</div>
              </div>
              <v-icon class="ml-2">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          
          <v-card class="profile-menu" min-width="280">
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-4">
                <v-avatar size="48" class="executive-avatar">
                  <div class="avatar-gradient">
                    <span class="avatar-initials">CEO</span>
                  </div>
                </v-avatar>
                <div class="ml-3">
                  <div class="text-h6 font-weight-bold">Executive User</div>
                  <div class="text-caption">CEO & Founder</div>
                </div>
              </div>
              
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-account-cog" title="Executive Settings" />
                <v-list-item prepend-icon="mdi-shield-account" title="Security Center" />
                <v-list-item prepend-icon="mdi-chart-timeline-variant" title="Performance Analytics" />
                <v-divider class="my-2" />
                <v-list-item prepend-icon="mdi-logout" title="Secure Logout" />
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const notifications = ref([
  {
    id: 1,
    title: 'Q4 Revenue Target Exceeded by 23%',
    time: '2 minutes ago',
    priority: 'success',
    icon: 'mdi-trending-up'
  },
  {
    id: 2,
    title: 'Board Meeting Scheduled - Tomorrow 2PM',
    time: '15 minutes ago',
    priority: 'warning',
    icon: 'mdi-calendar-clock'
  },
  {
    id: 3,
    title: 'New Market Opportunity Detected - Europe',
    time: '1 hour ago',
    priority: 'info',
    icon: 'mdi-earth'
  }
])
</script>

<style scoped>
.executive-header {
  background: linear-gradient(135deg, 
    var(--theme-surface, #FFFFFF) 0%, 
    rgba(var(--theme-primary), 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(var(--theme-primary), 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 24px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.stratos-logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  position: relative;
  width: 48px;
  height: 48px;
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
  animation: coreGlow 3s ease-in-out infinite alternate;
}

.logo-ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  border-color: transparent;
}

.ring-1 {
  width: 32px;
  height: 32px;
  border-top-color: #D4AF37;
  animation: ringRotate1 4s linear infinite;
}

.ring-2 {
  width: 40px;
  height: 40px;
  border-right-color: #3B82F6;
  animation: ringRotate2 6s linear infinite reverse;
}

.ring-3 {
  width: 48px;
  height: 48px;
  border-bottom-color: #F59E0B;
  animation: ringRotate3 8s linear infinite;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #D4AF37, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-size: 11px;
  font-weight: 600;
  color: var(--theme-textSecondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: -2px;
}

.status-bar {
  display: flex;
  gap: 24px;
  align-items: center;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-textSecondary);
  padding: 6px 12px;
  background: var(--theme-glass);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--theme-primary), 0.1);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.pulse-dot.success {
  background: #10B981;
  box-shadow: 0 0 10px #10B981;
}

.executive-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-toggle {
  background: var(--theme-glass) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--theme-primary), 0.1);
}

.notification-btn {
  background: var(--theme-glass) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--theme-primary), 0.1);
}

.executive-profile {
  background: var(--theme-glass) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--theme-primary), 0.1);
  border-radius: 50px !important;
  padding: 8px 16px !important;
  height: auto !important;
}

.executive-avatar {
  border: 2px solid var(--theme-accent);
}

.avatar-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #D4AF37, #F59E0B);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.avatar-initials {
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.profile-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.profile-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
}

.profile-role {
  font-size: 11px;
  color: var(--theme-textSecondary);
}

.notification-panel,
.profile-menu {
  background: var(--theme-surface);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--theme-primary), 0.1);
}

@keyframes coreGlow {
  0% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.5); }
  100% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.8); }
}

@keyframes ringRotate1 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ringRotate2 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ringRotate3 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
</style>
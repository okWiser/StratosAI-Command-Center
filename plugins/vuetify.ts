import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const executiveLightTheme = {
  dark: false,
  colors: {
    primary: '#0A1628',
    secondary: '#1E3A8A',
    accent: '#D4AF37',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    surface: '#FFFFFF',
    background: '#F8FAFC',
    'on-surface': '#0F172A',
    'surface-variant': '#F1F5F9',
    'primary-lighten-1': '#1E3A8A',
    'primary-darken-1': '#020617'
  }
}

const executiveDarkTheme = {
  dark: true,
  colors: {
    primary: '#D4AF37',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    surface: '#0F172A',
    background: '#020617',
    'on-surface': '#F8FAFC',
    'surface-variant': '#1E293B',
    'primary-lighten-1': '#F59E0B',
    'primary-darken-1': '#B45309'
  }
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: executiveLightTheme,
        dark: executiveDarkTheme
      }
    },
    defaults: {
      VCard: {
        elevation: 2,
        rounded: 'lg'
      },
      VBtn: {
        rounded: 'lg',
        style: 'text-transform: none; font-weight: 500;'
      }
    }
  })
  app.vueApp.use(vuetify)
})
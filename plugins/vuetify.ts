import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const executiveTheme = {
  dark: false,
  colors: {
    primary: '#1A237E',
    secondary: '#3F51B5',
    accent: '#FF6B35',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    surface: '#FAFAFA',
    background: '#F5F7FA',
    'on-surface': '#1A1A1A',
    'surface-variant': '#FFFFFF',
    'primary-lighten-1': '#3949AB',
    'primary-darken-1': '#1A237E'
  }
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'executiveTheme',
      themes: {
        executiveTheme
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
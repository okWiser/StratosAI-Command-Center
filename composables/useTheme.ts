export const useTheme = () => {
  const isDark = ref(false)
  const currentTheme = ref('executive-light')

  const themes = {
    'executive-light': {
      primary: '#0A1628',
      secondary: '#1E3A8A',
      accent: '#D4AF37',
      surface: '#FFFFFF',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      glass: 'rgba(255, 255, 255, 0.25)',
      text: '#0F172A',
      textSecondary: '#64748B'
    },
    'executive-dark': {
      primary: '#D4AF37',
      secondary: '#3B82F6',
      accent: '#F59E0B',
      surface: '#0F172A',
      background: 'linear-gradient(135deg, #020617 0%, #0F172A 100%)',
      glass: 'rgba(15, 23, 42, 0.8)',
      text: '#F8FAFC',
      textSecondary: '#94A3B8'
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    currentTheme.value = isDark.value ? 'executive-dark' : 'executive-light'
    updateCSSVariables()
  }

  const updateCSSVariables = () => {
    const theme = themes[currentTheme.value]
    const root = document.documentElement
    
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
  }

  onMounted(() => {
    updateCSSVariables()
  })

  return {
    isDark: readonly(isDark),
    currentTheme: readonly(currentTheme),
    toggleTheme,
    themes
  }
}
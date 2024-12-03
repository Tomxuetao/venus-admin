import { defineStore } from 'pinia'
export const useThemeState = defineStore('theme', {
  state: () => ({
    sidebar: '',
    topHeader: '',
    themeColor: '',
    navLayout: '',
    sidebarCollapse: true
  })
})

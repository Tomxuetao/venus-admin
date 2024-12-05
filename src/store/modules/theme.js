import { defineStore } from 'pinia'
export const useThemeState = defineStore('theme', {
  state: () => ({
    sidebar: '',
    topHeader: '',
    themeColor: '',
    collapse: false,
    showCrumb: true,
    navLayout: 'aside',
    uniqueOpened: true
  }),
  actions: {
    updateSidebar(value) {
      this.sidebar = value
    },
    updateTopHeader(value) {
      this.topHeader = value
    },
    updateThemeColor(value) {
      this.themeColor = value
    },
    updateShowCrumb(value) {
      this.showCrumb = value
    },
    updateNavLayout(value) {
      this.navLayout = value
    },
    updateCollapse(value) {
      this.collapse = value
    },
    updateUniqueOpened(value) {
      this.uniqueOpened = value
    }
  }
})

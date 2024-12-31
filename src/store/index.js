import { createPinia } from 'pinia'

import { useThemeState } from './modules/theme'
import { useCommonStore } from './modules/common'

const pinia = createPinia()

export { useThemeState, useCommonStore }

export const resetStore = () => {
  useThemeState().$reset()
  useCommonStore().$reset()
}

export default pinia

import { createPinia } from 'pinia'

import { useThemeState } from './modules/theme'
import { useCommonStore } from './modules/common'

const pinia = createPinia()

export { useThemeState, useCommonStore }
export default pinia

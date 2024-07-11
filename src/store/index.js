import { createPinia } from 'pinia'

import { useCommonStore } from './modules/common'

const pinia = createPinia()

export { useCommonStore }
export default pinia

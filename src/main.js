import { createApp } from 'vue'
import App from '@/App.vue'
import pinia from './store'
import router from '@/router'

import '@/assets/scss/index.scss'
import 'layout-vue3/lib/index.css'
import 'normalize.css/normalize.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

import IconSvg from '@/components/index'

const app = createApp(App)

app.use(pinia).use(router).use(IconSvg).mount('#app')

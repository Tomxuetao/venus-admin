import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from './store'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import '@/assets/scss/index.scss'
import 'normalize.css/normalize.css'
import 'layout-vue3/lib/index.css'

import IconSvg from '@/components/index'

const app = createApp(App)

app.use(pinia).use(router).use(ElementPlus).use(IconSvg).mount('#app')

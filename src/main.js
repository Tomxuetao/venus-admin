import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/scss/index.scss'
import 'normalize.css/normalize.css'

import http from '@/utils/http'
import IconSvg from '@/components/index'

const app = createApp(App)

app.use(store).use(router).use(ElementPlus).use(IconSvg).use(http).mount('#app')

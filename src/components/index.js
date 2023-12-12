import IconSvg from '@/components/icon-svg.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default (Vue) => {
	Vue.component('icon-svg', IconSvg)
	
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		Vue.component(key, component)
	}
}

export { IconSvg }

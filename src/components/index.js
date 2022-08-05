import IconSvg from '@/components/icon-svg.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default (app) => {
	app.component('icon-svg', IconSvg)
	
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}
}

export { IconSvg }

import IconSvg from '@/components/icon-svg.vue'
import CommonDesc from '@/components/common-desc.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import CommonPagination from '@/components/common-pagination.vue'

export default (Vue) => {
  Vue.component('icon-svg', IconSvg)
  Vue.component('common-desc', CommonDesc)
  Vue.component('common-pagination', CommonPagination)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(key, component)
  }
}

export { IconSvg }

import IconSvg from '@/components/icon-svg.vue'
import CommonPagination from '@/components/common-pagination.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default (Vue) => {
  Vue.component('icon-svg', IconSvg)
  Vue.component('common-pagination', CommonPagination)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(key, component)
  }
}

export { IconSvg }

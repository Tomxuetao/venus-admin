import IconSvg from '@/components/icon-svg.vue'
import CommonMap from '@/components/common-map.vue'
import CommonDesc from '@/components/common-desc.vue'
import CommonPager from '@/components/common-pager.vue'
import CommonUpload from '@/components/common-upload.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default (Vue) => {
  Vue.component('icon-svg', IconSvg)
  Vue.component('common-map', CommonMap)
  Vue.component('common-desc', CommonDesc)
  Vue.component('common-pager', CommonPager)
  Vue.component('common-upload', CommonUpload)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(key, component)
  }
}

export { IconSvg }

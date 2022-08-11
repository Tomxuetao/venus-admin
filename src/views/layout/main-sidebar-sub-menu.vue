<template>
  <el-sub-menu
      v-if="menu.children && menu.children.length >= 1"
      :index="menu.id"
      :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template #title>
      <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
        v-for="item in menu.children"
        :key="item.id"
        :menu="item"
        :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-sub-menu>
  <el-menu-item v-else :index="menu.id + ''" @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script setup>
import { isURL } from '@/utils'
import SubMenu from './main-sidebar-sub-menu.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  menu: {
    type: Object,
    required: true
  },
  dynamicMenuRoutes: {
    type: Array,
    required: true
  }
})

const store = useStore()
const router = useRouter()

const sidebarLayoutSkin = computed(() => {
  return store.state.common.sidebarLayoutSkin
})

const mainTabs = computed({
  get: () => {
    return store.state.common.mainTabs
  },
  set: value => {
    store.commit('common/updateMainTabs', value)
  }
})

const menuActiveName = computed({
  get: () => {
    return store.state.common.menuActiveName
  },
  set: value => {
    store.commit('common/updateMenuActiveName', value)
  }
})

const mainTabsActiveName = computed({
  get: () => {
    return store.state.common.mainTabsActiveName
  },
  set: value => {
    store.commit('common/updateMainTabsActiveName', value)
  }
})

const gotoRouteHandle = menu => {
  const route = router.getRoutes().find(item => item.meta.id === menu.id)
  if (route) {
    router.push({ name: route.name })
  }
}

const routeChange = (route) => {
  if (route.meta.isTab) {
    // tab选中, 不存在先添加
    let tab = mainTabs.value.find(item => item.id === route.meta.id)
    if (!tab) {
      tab = {
        id: route.meta.id,
        name: route.name,
        title: route.meta.title,
        type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
        iframeUrl: route.meta.iframeUrl || '',
        params: route.params,
        query: route.query
      }
      mainTabs.value = mainTabs.value.concat(tab)
    }
    menuActiveName.value = tab.name
    mainTabsActiveName.value = tab.name
  }
}
</script>

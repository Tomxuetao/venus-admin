<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-menu-item index="home" @click="$router.push({ name: 'home' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <template #title>
            首页
          </template>
        </el-menu-item>
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import { isURL } from '@/utils'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed, reactive, watch } from 'vue'

export default {
  components: {
    SubMenu
  },
  setup () {
    const route = useRoute()

    const store = useStore()

    const dynamicMenuRoutes = reactive([])

    const sidebarLayoutSkin = computed(() => {
      return store.state.common.sidebarLayoutSkin
    })

    const sidebarFold = computed(() => {
      return store.state.common.sidebarFold
    })

    const menuList = computed({
      get: () => {
        return store.state.common.menuList
      },
      set: value => {
        store.commit('common/updateMenuList', value)
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

    const mainTabs = computed({
      get: () => { return store.state.common.mainTabs },
      set: value => { store.commit('common/updateMainTabs', value) }
    })

    const mainTabsActiveName = computed({
      get: () => { return store.state.common.mainTabsActiveName },
      set: value => { store.commit('common/updateMainTabsActiveName', value) }
    })

    menuList.value = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    dynamicMenuRoutes.value = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')

    const routeHandle = routeName => {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        let tab = mainTabs.value.find(item => item.name === routeName)
        if (!tab) {
          if (route.meta.isDynamic) {
            const temp = dynamicMenuRoutes.value.find(item => item.name === routeName)
            if (!temp) {
              return console.error('未能找到可用标签页!')
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || '',
            params: route.params,
            query: route.query
          }
          mainTabs.value = mainTabs.value.concat(tab)
          console.log(mainTabs.value)
        }
        menuActiveName.value = tab.menuId + ''
        mainTabsActiveName.value = tab.name
      }
    }

    routeHandle(route.name)

    watch(() => route.name, value => {
      routeHandle(value)
    })

    return {
      dynamicMenuRoutes,
      sidebarLayoutSkin,
      sidebarFold,
      menuList,
      menuActiveName,
      mainTabs,
      mainTabsActiveName
    }
  }
}
</script>

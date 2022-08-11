<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
          :unique-opened="true"
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
            :key="menu.id"
            :menu="menu"
            :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script setup>
import SubMenu from './main-sidebar-sub-menu.vue'
import { treeDataTranslate } from '@/utils'
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'

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

const menuActiveName = computed(() => {
  return store.state.common.menuActiveName
})

menuList.value = treeDataTranslate(JSON.parse(sessionStorage.getItem('menuList') || '[]'))
</script>

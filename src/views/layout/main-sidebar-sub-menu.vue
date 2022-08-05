<template>
  <el-sub-menu
      v-if="menu.list && menu.list.length >= 1"
      :index="menu.menuId + ''"
      :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template #title>
      <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
        v-for="item in menu.list"
        :key="item.menuId"
        :menu="item"
        :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-sub-menu>
  <el-menu-item v-else :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script setup>
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

const gotoRouteHandle = menu => {
  const route = props.dynamicMenuRoutes.value.find(item => item.meta.menuId === menu.menuId)
  if (route) {
    router.push({ name: route.name })
  }
}

</script>

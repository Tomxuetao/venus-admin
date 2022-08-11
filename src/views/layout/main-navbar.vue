<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">Venus快速开发平台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">Venus</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu" mode="horizontal" :ellipsis="false">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal" :ellipsis="false">
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" :tabindex="0" placement="bottom">
            <div class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName" style="width: 36px; height: 36px">
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ userName }}</el-dropdown-item>
                <el-dropdown-item @click="updatePasswordHandle()">修改密码</el-dropdown-item>
                <el-dropdown-item @click="logoutHandle()">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePasswordRef"></update-password>
  </nav>
</template>

<script setup>
import UpdatePassword from './main-navbar-update-password.vue'
import { logoutApi } from '@/api/login-api'
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { clearLoginInfo } from '@/utils'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const router = useRouter()
const updatePasswordVisible = ref(false)
const updatePasswordRef = ref(null)

const navbarLayoutType = computed(() => {
  return store.state.common.navbarLayoutType
})

const sidebarFold = computed({
  get: () => {
    return store.state.common.sidebarFold
  },
  set: value => {
    store.commit('common/updateSidebarFold', value)
  }
})

const userName = computed(() => {
  return store.state.user.name
})

const updatePasswordHandle = () => {
  updatePasswordVisible.value = true
  nextTick(() => {
    updatePasswordRef.value.initDialogHandle()
  })
}

const logoutHandle = () => {
  ElMessageBox.confirm('确定进行[退出]操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logoutApi().then(() => {
      clearLoginInfo()
      const dynamicRouteList = router.getRoutes().filter(item => item.meta.isDynamic)
      dynamicRouteList.forEach(item => {
        router.removeRoute(item.name)
      })
      router.options.isDynamic = false
      router.push({ name: 'login' })
    })
  })
}
</script>

<style lang="scss" scoped>
.site-navbar {
  min-width: 1710px;
}
</style>

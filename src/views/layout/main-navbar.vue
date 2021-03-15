<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">人人快速开发平台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">人人</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
          <template v-slot:title>
            <el-badge value="new">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>
        <el-menu-item index="2">
          <el-badge value="hot">
            <a href="https://www.renren.io/" target="_blank">官方社区</a>
          </el-badge>
        </el-menu-item>
        <el-submenu index="3">
          <template v-slot:title>Git源码</template>
          <el-menu-item index="2-1"><a href="https://github.com/renrenio/renren-fast-vue" target="_blank">前端</a></el-menu-item>
          <el-menu-item index="2-2"><a href="https://gitee.com/renrenio/renren-fast" target="_blank">后台</a></el-menu-item>
          <el-menu-item index="2-3"><a href="https://gitee.com/renrenio/renren-generator" target="_blank">代码生成器</a></el-menu-item>
        </el-submenu>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" :tabindex="0" placement="bottom">
            <div class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName">
              <span>{{ userName }}</span>
            </div>
            <template v-slot:dropdown>
              <el-dropdown-menu>
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

<script>
import { ref, computed, nextTick, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import UpdatePassword from './main-navbar-update-password'
import { clearLoginInfo } from '@/utils'
import { useHttp } from '@/utils/http'
import { useRouter } from 'vue-router'
export default {
  components: {
    UpdatePassword
  },
  setup () {
    const http = useHttp()
    const store = useStore()
    const router = useRouter()
    const updatePasswordVisible = ref(false)
    const updatePasswordRef = ref(null)
    const { ctx } = getCurrentInstance()

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

    const mainTabs = computed({
      get: () => {
        return store.state.common.mainTabs
      },
      set: value => {
        store.commit('common/updateMainTabs', value)
      }
    })

    const userName = computed(() => {
      return store.state.user.name
    })

    const updatePasswordHandle = () => {
      updatePasswordVisible.value = true
      nextTick(() => {
        updatePasswordRef.value.init()
      })
    }

    const logoutHandle = () => {
      ctx.$confirm('确定进行[退出]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/logout'),
          method: 'post',
          data: http.adornData()
        }).then(({ code }) => {
          if (code === 0) {
            clearLoginInfo()
            router.push({ name: 'login' })
          }
        })
      })
    }

    return {
      updatePasswordVisible,
      updatePasswordRef,
      navbarLayoutType,
      sidebarFold,
      mainTabs,
      userName,

      updatePasswordHandle,
      logoutHandle
    }
  }
}
</script>

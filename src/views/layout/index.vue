<script setup>
import { commonApi } from '@/api/common-api'
import ImgBg from '@/assets/img/img-bg.webp'
import SvgIcon from '@/components/icon-svg.vue'
import { Layout as EvLayout } from 'layout-vue3'
import { useRouter, useRoute } from 'vue-router'
import LayoutConfig from '@/views/layout/layout-config.vue'
import {
 resetStore, useCommonStore, useThemeState 
} from '@/store'

defineOptions({
  name: 'main-layout'
})

const route = useRoute()
const router = useRouter()

const themeState = useThemeState()

const { userData, menuTree, updateToken } = useCommonStore()

const routes = router.getRoutes()

const activeId = ref(route.meta?.id)

const changeRoute = (id) => {
  if (activeId.value !== id) {
    activeId.value = id
    const targetRoute = routes.find((item) => item.meta.id === id)
    if (targetRoute) {
      router.push(targetRoute)
    }
  }
}

const commandMap = new Map([
  [''],
  [
    'theme',
    () => {
      showConfig.value = true
    }
  ],
  [
    'logout',
    async () => {
      resetStore()
      await commonApi('/logout', {}, { method: 'post' })
      updateToken('')
      await router.push({
        name: 'login'
      })
    }
  ]
])

const showConfig = ref(false)

const commandHandle = (command) => {
  const commandFn = commandMap.get(command)
  if (commandFn) {
    commandFn()
  }
}

watch(
  () => route.meta?.id,
  (id) => {
    activeId.value = id
  }
)
</script>

<template>
  <ev-layout
    class="layout-wrap"
    :img-bg="ImgBg"
    :menu-list="menuTree"
    :model-value="activeId"
    :collapse="themeState.collapse"
    :nav-mode="themeState.navLayout"
    @update:model-value="changeRoute"
    :show-crumb="themeState.showCrumb"
    :unique-opened="themeState.uniqueOpened"
  >
    <template #logo>
      <div class="logo-wrap">
        <img class="logo-img" src="@/assets/img/img-logo.webp" alt="" />
        <div class="logo-text">Venus后台管理</div>
      </div>
    </template>
    <template #fold>
      <div
        class="fold-wrap"
        @click="themeState.updateCollapse(!themeState.collapse)"
      >
        <img
          alt=""
          src="@/assets/img/img-fold.webp"
          :class="['fold-img', themeState.collapse ? 'img-fold' : 'img-open']"
        />
      </div>
    </template>
    <template #router>
      <router-view></router-view>
    </template>
    <template #menuIcon="menu">
      <svg-icon :name="menu.icon" class="menu-svg" />
    </template>
    <template #avatar>
      <div class="avatar-wrap">
        <el-dropdown
          placement="bottom"
          trigger="click"
          @command="commandHandle"
        >
          <div class="avatar-inner">
            <img class="inner-img" src="@/assets/img/avatar.webp" alt="" />
            <div class="inner-name">{{ userData.username }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="user">个人信息</el-dropdown-item>
              <el-dropdown-item command="theme">主题设置</el-dropdown-item>
              <el-dropdown-item divided command="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </ev-layout>
  <layout-config v-model="showConfig"></layout-config>
</template>

<style scoped lang="scss">
:root {
  --ev-header-height: 54px;
  --ev-primary-color: #ffffff;
}

.layout-wrap {
  .logo-wrap {
    display: flex;
    cursor: pointer;
    align-items: center;

    .logo-img {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }

    .logo-text {
      font-size: 22px;
      color: #1c365e;
      margin-left: 8px;
    }
  }

  .menu-svg {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }

  .menu-text {
    margin-left: 12px;
  }

  .fold-wrap {
    width: 32px;
    height: 32px;
    display: flex;
    cursor: pointer;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;

    .fold-img {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }

    @keyframes fold-rotate {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(180deg);
      }
    }

    .img-fold {
      transform: rotate(180deg);
      animation: fold-rotate 0.5s ease-out;
    }

    .img-open {
      transform: rotate(0deg);
      animation: fold-rotate 0.5s ease-out;
    }
  }

  .avatar-wrap {
    display: grid;
    cursor: pointer;

    .avatar-inner {
      display: grid;
      margin: 0 12px;
      grid-gap: 0 12px;
      align-items: center;
      grid-auto-flow: column;

      .inner-name {
        font-size: 18px;
        font-weight: 400;
        white-space: nowrap;
      }

      .inner-img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: contain;
      }
    }
  }
}
</style>

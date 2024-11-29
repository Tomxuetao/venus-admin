<script setup>
import { useCommonStore } from '@/store'
import { commonApi } from '@/api/common-api'
import imgBg from '@/assets/img/img-bg.webp'
import SvgIcon from '@/components/icon-svg.vue'
import { Layout as EvLayout } from 'layout-vue3'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'main-layout'
})

const { userData, menuTree, updateToken } = useCommonStore()

const collapse = ref(false)

const toggleCollapse = () => {
  collapse.value = !collapse.value
}

const route = useRoute()
const router = useRouter()

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

const navMode = ref('aside')
const commandMap = new Map([
  [''],
  [
    'layout',
    () => {
      navMode.value = navMode.value === 'aside' ? 'header' : 'aside'
    }
  ],
  [
    'logout',
    async () => {
      await commonApi('/logout', {}, { method: 'post' })
      updateToken('')
      await router.push({
        name: 'login'
      })
    }
  ]
])

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
    :img-bg="imgBg"
    :nav-mode="navMode"
    :show-crumb="true"
    :collapse="collapse"
    :menu-list="menuTree"
    :unique-opened="true"
    :model-value="activeId"
    @update:model-value="changeRoute"
  >
    <template #logo>
      <div class="logo-wrap">
        <img class="logo-img" src="@/assets/img/img-logo.webp" alt="" />
        <div class="logo-text">Venus后台管理</div>
      </div>
    </template>
    <template #fold>
      <div class="fold-wrap" @click="toggleCollapse()">
        <img
          :class="['fold-img', collapse ? 'img-fold' : 'img-open']"
          src="@/assets/img/img-fold.webp"
          alt=""
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
              <el-dropdown-item command="layout">布局设置</el-dropdown-item>
              <el-dropdown-item divided command="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </ev-layout>
</template>

<style scoped lang="scss">
:root {
  --ev-primary-color: #ffffff;
}

.layout-wrap {
  .logo-wrap {
    cursor: pointer;
    display: flex;
    align-items: center;

    .logo-img {
      width: 40px;
      height: 40px;
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

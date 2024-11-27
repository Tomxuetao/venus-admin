<script setup>
import { useCommonStore } from '@/store'
import imgBg from '@/assets/img/img-bg.webp'
import SvgIcon from '@/components/icon-svg.vue'
import { Layout as EvLayout } from 'layout-vue3'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'main-layout',
})

const commonStore = useCommonStore()

const collapse = ref(false)

const toggleCollapse = () => {
  collapse.value = !collapse.value
}

const route = useRoute()
const router = useRouter()

const routes = router.getRoutes()

const activeId = ref(route.meta.id)

const changeRoute = (id) => {
  if (activeId.value !== id) {
    activeId.value = id
    const targetRoute = routes.find((item) => item.meta.id === id)
    if (targetRoute) {
      router.push(targetRoute)
    }
  }
}

watch(
  () => route.meta.id,
  (id) => {
    activeId.value = id
  },
)
</script>

<template>
  <ev-layout
    class="layout-wrap"
    :img-bg="imgBg"
    :show-crumb="true"
    :collapse="collapse"
    :unique-opened="true"
    :model-value="activeId"
    :menu-list="commonStore.menuTree"
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
}
</style>

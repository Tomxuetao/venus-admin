<template>
  <div class="site-wrapper"
      :class="{ 'site-sidebar--fold': sidebarFold }"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar></main-navbar>
      <main-sidebar></main-sidebar>
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content v-if="!$store.state.common.contentIsNeedRefresh"></main-content>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, ref, provide, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useHttp } from '@/utils/http'
import MainNavbar from './main-navbar.vue'
import MainSidebar from './main-sidebar.vue'
import MainContent from './main-content.vue'

export default {
  components: {
    MainNavbar,
    MainSidebar,
    MainContent
  },
  setup() {
    const loading = ref(true)

    const store = useStore()
    const http = useHttp()
    // computed
    const documentClientHeight = computed({
      get: () => {
        return store.state.common.documentClientHeight
      },
      set: value => {
        store.commit('common/updateDocumentClientHeight', value)
      }
    })

    const sidebarFold = computed(() => {
      return store.state.common.sidebarFold
    })

    const userId = computed({
      get: () => {
        return store.state.user.id
      },
      set: value => {
        store.commit('user/updateId', value)
      }
    })

    const userName = computed({
      get: () => {
        return store.state.user.name
      },
      set: value => {
        store.commit('user/updateName', value)
      }
    })

    // methods
    const resetDocumentClientHeight = () => {
      documentClientHeight.value = document.documentElement.clientHeight
      window.onresize = () => {
        documentClientHeight.value = document.documentElement.clientHeight
      }
    }

    const getUserInfo = () => {
      http({
        url: http.adornUrl('/sys/user/info'),
        method: 'get'
      }).then(({ code, user }) => {
        if (code === 200) {
          loading.value = false
          userId.value = user.userId
          userName.value = user.username
        }
      })
    }
    getUserInfo()

    // provide
    provide('refreshHandle', () => {
      store.commit('common/updateContentIsNeedRefresh', true)
      nextTick(() => {
        store.commit('common/updateContentIsNeedRefresh', false)
      })
    })

    // lifecycle
    onMounted(() => {
      resetDocumentClientHeight()
    })

    return {
      loading,
      documentClientHeight,
      sidebarFold,
      userId,
      userName
    }
  }
}
</script>

<template>
  <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }">
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
import { defineComponent, computed, ref, provide, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useHttp } from '@/utils/http'
import MainNavbar from './main-navbar.vue'
import MainSidebar from './main-sidebar.vue'
import MainContent from './main-content.vue'

export default defineComponent({
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
      }).then(({ code, data }) => {
        if (code === 200) {
          loading.value = false
          userId.value = data.userId
          userName.value = data.username
        }
      })
    }
    getUserInfo()

    provide('refreshHandle', () => {
      store.commit('common/updateContentIsNeedRefresh', true)
      nextTick(() => {
        store.commit('common/updateContentIsNeedRefresh', false)
      })
    })

    onMounted(() => {
      resetDocumentClientHeight()
    })

    return {
      userId,
      loading,
      userName,
      sidebarFold,
      documentClientHeight
    }
  }
})
</script>

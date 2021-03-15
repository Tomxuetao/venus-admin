<template>
  <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
    <!-- 主入口标签页 s -->
    <el-tabs v-if="$route.meta.isTab" v-model="mainTabsActiveName" :closable="true" @tab-click="selectedTabHandle" @tab-remove="removeTabHandle">
<!--      <el-dropdown class="site-tabs__tools" :show-timeout="0" :tabindex="0" placement="bottom-end">-->
<!--        <el-icon name="arrow-down" class="el-icon&#45;&#45;right"></el-icon>-->
<!--        <template v-slot:dropdown>-->
<!--          <el-dropdown-menu>-->
<!--            <el-dropdown-item @click="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>-->
<!--            <el-dropdown-item @click="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>-->
<!--            <el-dropdown-item @click="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>-->
<!--            <el-dropdown-item @click="refreshHandle()">刷新当前标签页</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </template>-->
<!--      </el-dropdown>-->
      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name">
        <el-card :body-style="siteContentViewHeight">
          <iframe
            v-if="item.type === 'iframe'"
            :src="item.iframeUrl"
            width="100%" height="100%" frameborder="0" scrolling="yes">
          </iframe>
          <router-view v-if="item.name === mainTabsActiveName"/>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card v-else :body-style="siteContentViewHeight">
      <router-view/>
    </el-card>
  </main>
</template>

<script>
import { isURL } from '@/utils'
import { computed, inject, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'main-content',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    // computed
    const documentClientHeight = computed({
      get: () => {
        return store.state.common.documentClientHeight
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
      get: () => {
        return store.state.common.mainTabs
      },
      set: value => {
        store.commit('common/updateMainTabs', value)
      }
    })

    console.log(mainTabs.value)
    console.log(router.getRoutes())

    const mainTabsActiveName = computed({
      get: () => {
        return store.state.common.mainTabsActiveName
      },
      set: value => {
        store.commit('common/updateMainTabsActiveName', value)
      }
    })

    const siteContentViewHeight = computed({
      get: () => {
        let height = documentClientHeight.value - 50 - 30 - 2
        if (route.meta.isTab) {
          height -= 40
          return isURL(route.meta.iframeUrl) ? `height: ${height}px ` : `min-height: ${height}px`
        }
        return `min-height: ${height}px`
      }
    })

    /** methods **/
    const refreshHandle = inject('refreshHandle')

    const selectedTabHandle = (tab) => {
      tab = mainTabs.value.filter(item => item.name === tab.name)
      if (tab.length >= 1) {
        router.push({
          name: tab[0].name,
          query: tab[0].query,
          params: tab[0].params
        })
      }
    }

    const removeTabHandle = (tabName) => {
      mainTabs.value = mainTabs.value.filter(item => item.name !== tabName)
      if (mainTabs.value.length >= 1) {
        // 当前选中tab被删除
        if (tabName === mainTabsActiveName.value) {
          const tab = mainTabs.value[mainTabs.value.length - 1]
          router.push({
            name: tab.name,
            query: tab.query,
            params: tab.params
          }).then(() => {
            mainTabsActiveName.value = route.name
          })
        }
      } else {
        menuActiveName.value = ''
        router.push({ name: 'home' })
      }
    }

    const tabsCloseCurrentHandle = () => {
      removeTabHandle(mainTabsActiveName.value)
    }

    const tabsCloseOtherHandle = () => {
      mainTabs.value = mainTabs.value.filter(item => item.name === mainTabsActiveName.value)
    }

    const tabsCloseAllHandle = () => {
      mainTabs.value = []
      menuActiveName.value = ''
      router.push({ name: 'home' })
    }

    const tabsRefreshCurrentHandle = () => {
      const tab = this.$route
      this.removeTabHandle(tab.name)
      nextTick(() => {
        router.push({
          name: tab.name,
          query: tab.query,
          params: tab.params
        })
      })
    }

    return {
      siteContentViewHeight,
      mainTabsActiveName,
      mainTabs,
      refreshHandle,

      selectedTabHandle,
      removeTabHandle,
      tabsCloseCurrentHandle,
      tabsCloseOtherHandle,
      tabsCloseAllHandle,
      tabsRefreshCurrentHandle
    }
  }
}
</script>

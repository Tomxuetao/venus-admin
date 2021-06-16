<template>
  <el-form>
    <h2>布局设置</h2>
    <el-form-item label="导航条类型">
      <el-radio-group v-model="navbarLayoutType">
        <el-radio label="default" border>default</el-radio>
        <el-radio label="inverse" border>inverse</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="侧边栏皮肤">
      <el-radio-group v-model="sidebarLayoutSkin">
        <el-radio label="light" border>light</el-radio>
        <el-radio label="dark" border>dark</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, computed} from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const navbarLayoutType = computed({
      get: () => {
        return store.state.common.navbarLayoutType
      },
      set: (value) => {
        store.commit('common/updateNavbarLayoutType', value)
      }
    })

    const sidebarLayoutSkin = computed({
      get: () => {
        return store.state.common.sidebarLayoutSkin
      },
      set: (value) => {
        store.commit('common/updateSidebarLayoutSkin', value)
      }
    })

    return {
      navbarLayoutType,
      sidebarLayoutSkin
    }
  }
})
</script>

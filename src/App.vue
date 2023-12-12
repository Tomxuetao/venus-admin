<template>
  <el-config-provider :locale="zhCn" :size="'large'">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn'
</script>

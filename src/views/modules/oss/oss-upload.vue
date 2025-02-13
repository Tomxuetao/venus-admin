<script setup>
import { venusServer } from '@/utils/http'

const emit = defineEmits(['refresh-data-list'])

let visible = ref(false)

let url = ref(null)

const initDialogHandle = (path = '/sys/oss/upload') => {
  url.value = `${venusServer}${path}?token=${sessionStorage.getItem('token')}`
  visible.value = true
}

// 弹窗关闭时
const closeHandle = () => {
  visible.value = false
  emit('refresh-data-list')
}

defineExpose({
  initDialogHandle
})
</script>

<template>
  <el-dialog
    width="40%"
    title="上传文件"
    v-model="visible"
    @close="closeHandle"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <common-upload
      drag
      :action="url"
      accept="*"
      multiple
      @success="closeHandle"
    >
    </common-upload>
  </el-dialog>
</template>

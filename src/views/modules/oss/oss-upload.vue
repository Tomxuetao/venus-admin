<script setup>
import { venusServer } from '@/utils/http'

import { ElMessageBox, ElMessage } from 'element-plus'

const emit = defineEmits(['refresh-data-list'])

let visible = ref(false)

let num = ref(0)
let url = ref(null)
let fileList = ref([])
let successNum = ref(0)

const initDialogHandle = (path = '/sys/oss/upload') => {
  url.value = `${venusServer}${path}?token=${sessionStorage.getItem('token')}`
  visible.value = true
}

// 上传之前
const beforeUploadHandle = () => {
  num.value++
}

// 上传成功
const successHandle = (response, file, list) => {
  fileList.value = list
  successNum.value++
  if (response?.code === 200) {
    if (num.value === successNum.value) {
      ElMessageBox.confirm('操作成功, 是否继续操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        visible.value = false
      })
    }
  } else {
    ElMessage.error(response.msg)
  }
}

// 弹窗关闭时
const closeHandle = () => {
  fileList.value = []
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
    <el-upload
      drag
      :action="url"
      multiple
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      :file-list="fileList"
      style="text-align: center"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </el-dialog>
</template>

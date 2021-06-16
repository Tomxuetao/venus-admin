<template>
  <el-dialog
    title="上传文件"
    :close-on-click-modal="false"
    @close="closeHandle"
    v-model="visible">
    <el-upload drag :action="url" :before-upload="beforeUploadHandle" :on-success="successHandle" multiple :file-list="fileList" style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip">只支持jpg、png、gif格式的图片！</div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { useHttp } from '@/utils/http'

export default defineComponent({
  emits: ['refresh-data-list'],

  setup(props, { emit }) {
    const http = useHttp()
    const { ctx } = getCurrentInstance()

    let visible = ref(false)

    let fileList = ref([])
    let url = ref(null)
    let num = ref(0)
    let successNum = ref(0)

    const initDialogHandle = () => {
      url.value = http.adornUrl(`/sys/oss/upload?token=${localStorage.getItem('token')}`)
      visible.value = true
    }

    // 上传之前
    const beforeUploadHandle = (file) => {
      const fileTypeArray = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      if (!fileTypeArray.includes(file.type)) {
        ctx.$message.error('只支持jpg、png、gif格式的图片！')
        return false
      }
      num.value++
    }

    // 上传成功
    const successHandle = (response, file, list) => {
      fileList.value = list
      successNum.value++
      if (response && response.code === 200) {
        if (num.value === successNum.value) {
          ctx.$confirm('操作成功, 是否继续操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(() => {
            visible.value = false
          })
        }
      } else {
        ctx.$message.error(response.msg)
      }
    }

    // 弹窗关闭时
    const closeHandle = () => {
      fileList.value = []
      emit('refresh-data-list')
    }

    return {
      url,
      visible,
      fileList,

      closeHandle,
      successHandle,
      initDialogHandle,
      beforeUploadHandle
    }
  }
})
</script>

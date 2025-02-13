<script setup>
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { validateIsSingleShpZip } from '@/utils/zip-utils'

const ossUrl = defineModel({
  type: String,
  default: ''
})

const uploadUrl = defineModel('uploadUrl', {
  type: String,
  default: '/api/file/upload'
})

/**
 * 上传前验证
 * @param file
 * @returns {Promise<boolean>}
 */
const beforeUploadHandle = async (file) => {
  if (file.type !== 'application/zip') {
    ElMessage.error('请上传zip格式的文件')
    return false
  } else if (file.size > 1024 * 1024 * 100) {
    ElMessage.error('文件大小不能超过100M')
    return false
  } else {
    // 验证是否为shp文件
    const isSingleShpZip = await validateIsSingleShpZip(file)
    if (!isSingleShpZip) {
      ElMessage.error('请上传单个Shp压缩文件')
      return false
    }
    return true
  }
}
</script>

<template>
  <common-upload
    v-model="ossUrl"
    drag
    :limit="1"
    accept=".zip"
    style="width: 100%"
    :auto-upload="true"
    :action="uploadUrl"
    :before-upload="beforeUploadHandle"
  >
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      请上传单个Shp压缩文件，压缩包内不能包含文件夹！
    </div>
  </common-upload>
</template>

<style scoped lang="scss"></style>

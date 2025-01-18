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

// 上传成功
const successUploadHandle = (response) => {
  if (response?.code === 200) {
    const { data } = response
    ossUrl.value = data.src.replace('/venus-data/', '')
  } else {
    ElMessage.error(response.msg)
  }
}

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

/**
 * 超过限制数量
 * @param files
 */
const onExceedHandle = (files) => {
  ElMessage.error('只能上传一个文件')
  if (files.length > 1) {
    ElMessage.error('只能上传一个文件')
  }
}
</script>

<template>
  <el-upload
    drag
    :limit="1"
    accept=".zip"
    style="width: 100%"
    :auto-upload="true"
    :action="uploadUrl"
    :on-exceed="onExceedHandle"
    :on-success="successUploadHandle"
    :before-upload="beforeUploadHandle"
    :on-remove="
      () => {
        ossUrl = undefined
      }
    "
  >
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      请上传单个Shp压缩文件，压缩包内不能包含文件夹！
    </div>
  </el-upload>
</template>

<style scoped lang="scss"></style>

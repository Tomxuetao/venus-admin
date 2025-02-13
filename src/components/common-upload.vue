<script setup>
import { ElMessage } from 'element-plus'
import { venusServer } from '@/utils/http'

const slots = useSlots()
const emit = defineEmits(['success'])

const ossUrl = defineModel({
  type: String,
  default: ''
})

const uploadUrl = defineModel('uploadUrl', {
  type: String,
  default: `${venusServer}/sys/oss/upload?token=${sessionStorage.getItem('token')}`
})

const props = defineProps({
  drag: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 5
  },
  disabled: {
    type: Boolean,
    default: false
  },
  listType: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'picture', 'picture-card'].includes(value)
  },
  fileList: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  showFileList: {
    type: Boolean,
    default: false
  },
  beforeUploadHandle: {
    type: Function,
    default: () => true
  }
})

const innerFileList = ref([])

const onRemove = (file) => {
  innerFileList.value = innerFileList.value.filter(
    (item) => item.id !== file.id
  )
}

const onExceed = () => {
  ElMessage.error(`上传文件数量不能超过 ${props.limit}个!`)
}

const onSuccess = (response, file) => {
  if (response?.code === 200) {
    const { data } = response
    ossUrl.value = data.src.replace('/venus-data/', '')
    file.id = data.id
    innerFileList.value.push(data)
    emit('success', innerFileList.value)
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.msg)
  }
}

const beforeUpload = (file) => {
  if (file.size > props.maxSize * 1024 * 1024) {
    ElMessage.error(`上传文件大小不能超过 ${props.maxSize}MB!`)
    return false
  }

  if (innerFileList.value.length >= props.limit) {
    ElMessage.error(`上传文件数量不能超过 ${props.limit}个!`)
    return false
  }

  if (props.beforeUploadHandle) {
    return props.beforeUploadHandle(file)
  }
}
</script>

<template>
  <el-upload
    :drag="drag"
    :limit="limit"
    :accept="accept"
    :auto-upload="true"
    :action="uploadUrl"
    :multiple="multiple"
    :disabled="disabled"
    :file-list="fileList"
    :on-remove="onRemove"
    :on-exceed="onExceed"
    :list-type="listType"
    :on-success="onSuccess"
    style="text-align: center"
    :before-upload="beforeUpload"
    :show-file-list="showFileList"
  >
    <template v-if="slots.default">
      <slot></slot>
    </template>
    <template v-else>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </template>
  </el-upload>
</template>

<style scoped lang="scss"></style>

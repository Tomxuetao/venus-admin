<script setup>
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'
import { Plus } from '@element-plus/icons-vue'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

let dataForm = reactive({
  files: '',
  lng: undefined,
  lat: undefined,
  name: undefined,
  area: undefined,
  num: undefined,
  type: undefined,
  dist: undefined,
  intro: undefined,
  street: undefined,
  address: undefined,
  busHours: undefined
})

const dataRule = {
  name: [
    {
      required: true,
      message: '点位名称不能为空',
      trigger: 'blur'
    }
  ],
  area: [
    {
      required: true,
      message: '所属分类不能为空',
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      message: '应用地址不能为空',
      trigger: 'blur'
    }
  ],
  appType: [
    {
      required: true,
      message: '应用类型不能为空',
      trigger: 'blur'
    }
  ],
  files: [
    {
      required: true,
      message: '应用图标不能为空',
      trigger: 'blur'
    }
  ]
}

const fileList = ref([])
const dataFormRef = ref()

const initDialogHandle = async (id) => {
  dataForm.id = id
  visible.value = true
  if (id) {
    commonApi(`/city/site/${id}`).then((data) => {
      Object.assign(dataForm, data)
      const tempFileList = JSON.parse(data?.files) || []
      fileList.value = tempFileList.map((item) => ({ ...item, url: item.src }))
    })
  }
}

// 表单提交
const dataFormSubmit = () => {
  dataForm.files = JSON.stringify(fileList.value || [])
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi(
        `/city/site/${dataForm.id ? 'update' : 'save'}`,
        dataForm,
        {
          method: dataForm.id ? 'put' : 'post'
        }
      )
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refresh-data-list')
        }
      })
    }
  })
}

defineExpose({
  init: initDialogHandle
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="40%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="!dataForm.id ? '新增' : '修改'"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataFormRef"
      label-width="80px"
      @keyup.enter="dataFormSubmit()"
    >
      <el-form-item prop="name" label="点位名称">
        <el-input v-model="dataForm.name" placeholder="点位名称"></el-input>
      </el-form-item>
      <el-form-item prop="area" label="所属城区">
        <el-input v-model="dataForm.area" placeholder="所属城区"></el-input>
      </el-form-item>
      <el-form-item prop="street" label="所属街道">
        <el-input v-model="dataForm.s" placeholder="所属街道"></el-input>
      </el-form-item>
      <el-form-item prop="address" label="详细地址">
        <el-input
          v-model="dataForm.address"
          type="textarea"
          placeholder="详细地址"
        ></el-input>
      </el-form-item>
      <el-form-item prop="busHours" label="营业时间">
        <el-input
          v-model="dataForm.busHours"
          type="textarea"
          placeholder="营业时间"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type" label="业态类型">
        <el-input
          v-model="dataForm.type"
          type="textarea"
          placeholder="业态类型"
        ></el-input>
      </el-form-item>
      <el-form-item prop="dist" label="业态分布">
        <el-input
          v-model="dataForm.dist"
          type="textarea"
          placeholder="业态分布"
        ></el-input>
      </el-form-item>
      <el-form-item prop="intro" label="点位介绍">
        <el-input
          v-model="dataForm.intro"
          type="textarea"
          placeholder="点位介绍"
        ></el-input>
      </el-form-item>
      <el-form-item prop="files" label="图片">
        <common-upload
          :limit="5"
          :accept="'image/*'"
          :maxSize="5"
          :disabled="false"
          :multiple="false"
          :showFileList="true"
          :listType="'picture-card'"
          v-model:fileList="fileList"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </common-upload>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

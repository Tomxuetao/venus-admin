<script setup>
import { useCommonStore } from '@/store'
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'
import { Plus } from '@element-plus/icons-vue'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

const { dictMap } = useCommonStore()

const appTypeMap = dictMap.get('app_type')

const classifyMap = dictMap.get('app_classify')

let dataForm = reactive({
  appName: undefined,
  appType: 0,
  sort: 0,
  status: 1,
  remark: undefined,
  appIcon: undefined,
  classify: undefined,
  redirectUri: undefined
})

const dataRule = {
  appName: [
    {
      required: true,
      message: '应用名称不能为空',
      trigger: 'blur'
    }
  ],
  classify: [
    {
      required: true,
      message: '所属分类不能为空',
      trigger: 'blur'
    }
  ],
  redirectUri: [
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
  appIcon: [
    {
      required: true,
      message: '应用图标不能为空',
      trigger: 'blur'
    }
  ]
}

let dataFormRef = ref()

const initDialogHandle = async (id) => {
  dataForm.id = id
  visible.value = true
  if (id) {
    commonApi(`/sys/client/${id}`).then((data) => {
      Object.assign(dataForm, data)
    })
  }
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi(
        `/sys/client/${dataForm.id ? 'update' : 'save'}`,
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
      <el-form-item prop="appName" label="应用名称">
        <el-input v-model="dataForm.appName" placeholder="应用名称"></el-input>
      </el-form-item>
      <el-form-item prop="classify" label="所属分类">
        <el-select v-model="dataForm.classify" placeholder="所属分类">
          <el-option
            v-for="([key, value], index) in classifyMap"
            :key="index"
            :value="key"
            :label="value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="appType" label="应用类型">
        <el-select v-model="dataForm.appType" placeholder="应用类型">
          <el-option
            v-for="([key, value], index) in appTypeMap"
            :key="index"
            :value="key"
            :label="value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="redirectUri" label="应用地址">
        <el-input
          v-model="dataForm.redirectUri"
          placeholder="应用地址"
        ></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number
          v-model="dataForm.sort"
          controls-position="right"
          :min="0"
          label="排序"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          placeholder="备注"
        ></el-input>
      </el-form-item>
      <el-form-item prop="appIcon" label="图标">
        <common-upload
          v-model="dataForm.appIcon"
          :limit="1"
          :accept="'image/*'"
          :maxSize="5"
          :fileList="[]"
          :disabled="false"
          :multiple="false"
          :showFileList="true"
          :listType="'picture-card'"
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

<script setup>
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'

const visible = defineModel()
const emit = defineEmits(['refreshDataList'])

const dataFormRef = ref()

const dataForm = reactive({
  id: '',
  paramCode: '',
  paramValue: '',
  remark: ''
})

const rules = ref({
  paramCode: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur'
    }
  ],
  paramValue: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur'
    }
  ]
})

const initDialogHandle = (id) => {
  visible.value = true
  dataForm.id = id

  if (id) {
    commonApi(`/sys/params/${id}`).then((data) => {
      Object.assign(dataForm, data)
    })
  }
}

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid) => {
    if (!valid) {
      return false
    }
    commonApi('/sys/params', dataForm, {
      method: dataForm.id ? 'put' : 'post'
    }).then(() => {
      ElMessage.success({
        message: '成功',
        duration: 500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
        }
      })
    })
  })
}

defineExpose({
  init: initDialogHandle
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="!dataForm.id ? '新增' : '修改'"
  >
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataFormRef"
      label-width="120px"
      @keyup.enter="dataFormSubmitHandle()"
    >
      <el-form-item prop="paramCode" label="编码">
        <el-input v-model="dataForm.paramCode" placeholder="编码"></el-input>
      </el-form-item>
      <el-form-item prop="paramValue" label="值">
        <el-input v-model="dataForm.paramValue" placeholder="值"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

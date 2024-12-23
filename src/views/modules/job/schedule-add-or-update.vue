<script setup>
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

let dataForm = reactive({
  id: undefined,
  beanName: '',
  params: '',
  cronExpression: '',
  remark: '',
  status: 0
})

const dataRule = {
  beanName: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }
  ],
  cronExpression: [
    {
      required: true,
      message: 'cron表达式不能为空',
      trigger: 'blur'
    }
  ]
}

const dataFormRef = ref()
const initDialogHandle = (id) => {
  dataForm.id = id
  visible.value = true
  nextTick(async () => {
    if (dataFormRef.value) {
      dataFormRef.value.resetFields()
    }
    if (dataForm.id) {
      const data = await commonApi(`/sys/schedule/${dataForm.id}`, {}, {})
      dataForm = Object.assign(dataForm, data)
    }
  })
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi(`/sys/schedule/${!dataForm.id ? 'save' : 'update'}`)
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
      label-width="100px"
    >
      <el-form-item label="bean名称" prop="beanName">
        <el-input
          v-model="dataForm.beanName"
          placeholder="spring bean名称, 如: testTask"
        ></el-input>
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="参数"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input
          v-model="dataForm.cronExpression"
          placeholder="如: 0 0 12 * * ?"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

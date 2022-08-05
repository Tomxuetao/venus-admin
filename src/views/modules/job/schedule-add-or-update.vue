<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="100px">
      <el-form-item label="bean名称" prop="beanName">
        <el-input v-model="dataForm.beanName" placeholder="spring bean名称, 如: testTask"></el-input>
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="参数"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="如: 0 0 12 * * ?"></el-input>
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

<script setup>
import { reactive, ref, nextTick } from 'vue'
import { useHttp } from '@/utils/http'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refresh-data-list'])

const http = useHttp()

let dataForm = reactive({
  id: undefined,
  beanName: '',
  params: '',
  cronExpression: '',
  remark: '',
  status: 0
})

const dataRule = reactive({
  beanName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  cronExpression: [
    { required: true, message: 'cron表达式不能为空', trigger: 'blur' }
  ]
})

let visible = ref(false)
let dataFormRef = ref(null)
const initDialogHandle = (id) => {
  dataForm.id = id
  visible.value = true
  nextTick(() => {
    if (dataFormRef.value) {
      dataFormRef.value.resetFields()
    }
    if (dataForm.id) {
      http({
        url: http.adornUrl(`/sys/schedule/info/${dataForm.id}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ code, data }) => {
        if (code === 200) {
          dataForm = Object.assign(dataForm, data)
        }
      })
    }
  })
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl(`/sys/schedule/${!dataForm.id ? 'save' : 'update'}`),
        method: 'post',
        data: http.adornData(dataForm)
      }).then(({ code, msg }) => {
        if (code === 200) {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              emit('refresh-data-list')
            }
          })
        } else {
          ElMessage.error(msg)
        }
      })
    }
  })
}

defineExpose({
  initDialogHandle
})
</script>

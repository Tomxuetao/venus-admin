<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px">
      <el-form-item label="参数名" prop="paramKey">
        <el-input v-model="dataForm.paramKey" placeholder="参数名"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refresh-data-list'])

let dataForm = reactive({
  id: undefined,
  paramKey: '',
  paramValue: '',
  remark: ''
})

const dataRule = reactive({
  paramKey: [
    {
      required: true,
      message: '参数名不能为空',
      trigger: 'blur'
    }
  ],
  paramValue: [
    {
      required: true,
      message: '参数值不能为空',
      trigger: 'blur'
    }
  ]
})

let visible = ref(false)
let dataFormRef = ref(null)

const initDialogHandle = (id) => {
  visible.value = true
  nextTick(() => {
    if (dataFormRef.value) {
      dataFormRef.value.resetFields()
    }
  })
  dataForm.id = id
  if (dataForm.id) {
    http({
      url: http.adornUrl(`/sys/config/info/${dataForm.id}`),
      method: 'get',
      params: http.adornParams()
    }).then(({ data, code }) => {
      if (code === 200) {
        dataForm = Object.assign(dataForm, data)
      }
    })
  }
}

const dataFormSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl(`/sys/config/${!dataForm.id ? 'save' : 'update'}`),
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
          visible.value = false
          emit('refresh-data-list')
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

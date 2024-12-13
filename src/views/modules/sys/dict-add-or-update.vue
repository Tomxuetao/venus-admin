<script setup>
import { commonApi } from '@/api/common-api'
import { ElMessage } from 'element-plus'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

const dataForm = reactive({
  pid: '0',
  sort: 0,
  status: 1,
  id: undefined,
  label: undefined,
  value: undefined,
  remark: undefined
})

let dataFormRef = ref()

const dataRule = {
  label: [
    {
      required: true,
      message: '字典标签不能为空',
      trigger: 'blur'
    }
  ],
  value: [
    {
      required: true,
      message: '字典值不能为空',
      trigger: 'blur'
    }
  ],
  remark: [
    {
      required: true,
      message: '备注不能为空',
      trigger: 'blur'
    }
  ]
}

const initDialogHandle = (id, pid = undefined) => {
  dataForm.id = id
  visible.value = true
  dataForm.pid = pid ? pid : '0'
  if (id) {
    commonApi(`/sys/dict/${id}`).then((data) => {
      Object.assign(dataForm, data)
    })
  }
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi('/sys/dict', dataForm, {
        method: dataForm.id ? 'put' : 'post'
      })
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
    width="30%"
    v-model="visible"
    :destroy-on-close="true"
    :title="!dataForm.id ? '新增' : '修改'"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataFormRef"
      label-width="80px"
      @keyup.enter="dataFormSubmit()"
    >
      <el-form-item prop="label" label="字典标签">
        <el-input v-model="dataForm.label" placeholder="字典标签"></el-input>
      </el-form-item>
      <el-form-item prop="value" label="字典值">
        <el-input v-model="dataForm.value" label="字典值" placeholder="字典值">
        </el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number
          v-model="dataForm.sort"
          controls-position="right"
          label="排序"
          :min="0"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :value="1">正常</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="dataForm.remark"
          placeholder="备注"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

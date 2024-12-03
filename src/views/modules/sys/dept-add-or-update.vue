<script setup>
import { ElMessage } from 'element-plus'
import { treeDataTranslate } from '@/utils'
import { commonApi } from '@/api/common-api'

const emit = defineEmits(['refresh-data-list'])

let dataForm = reactive({
  id: undefined,
  name: '',
  pid: 0,
  sort: 0,
  parentName: '',
})

const dataRule = {
  name: [
    {
      required: true,
      message: '部门名称不能为空',
      trigger: 'blur',
    },
  ],
  pid: [
    {
      required: true,
      message: '上级部门不能为空',
      trigger: 'blur',
    },
  ],
}

let dataFormRef = ref()
let visible = ref(false)

let deptTreeList = ref([])

const getDataList = async () => {
  const dataList = await commonApi('/sys/dept/list')

  deptTreeList.value = treeDataTranslate(dataList)
}

getDataList()

const initDialogHandle = (id) => {
  dataForm.id = id
  visible.value = true
  if (id) {
    commonApi(`/sys/dept/${id}`).then((data) => {
      Object.assign(dataForm, data)
    })
  }
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi('/sys/dept', dataForm, {
        method: dataForm.id ? 'put' : 'post',
      })
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refresh-data-list')
        },
      })
    }
  })
}

defineExpose({
  init: initDialogHandle,
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
      :rules="dataRule"
      ref="dataFormRef"
      label-width="120px"
      @keyup.enter="dataFormSubmit()"
    >
      <el-form-item prop="name" label="名称">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="pid" label="上级部门" class="dept-list">
        <el-tree-select
          v-model="dataForm.pid"
          :data="deptTreeList"
          node-key="id"
          check-strictly
          check-on-click-node
          :render-after-expand="false"
          :props="{ label: 'name', children: 'children' }"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number
          v-model="dataForm.sort"
          controls-position="right"
          :min="0"
          label="排序"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

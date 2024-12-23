<script setup>
import { buildTree } from '@/utils'
import { ElMessage } from 'element-plus'
import { useCommonStore } from '@/store'
import { commonApi } from '@/api/common-api'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

let btnLoading = ref(false)
let expandedKeys = ref([1])
let dataForm = reactive({
  id: undefined,
  name: '',
  remark: ''
})

const { menuList } = useCommonStore()

const dataFormRef = ref()
const menuListTreeRef = ref()

let menuListTree = buildTree([...menuList], '0')

const initDialogHandle = (id) => {
  visible.value = true
  btnLoading.value = false
  dataForm.id = id
  if (id) {
    commonApi(`/sys/role/${id}`).then((data) => {
      dataForm.name = data.name
      dataForm.remark = data.remark
      menuListTreeRef.value.setCheckedKeys(data.menuIdList)
    })
  }
}

const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    btnLoading.value = true
    if (valid) {
      await commonApi(
        `/sys/role/${!dataForm.id ? 'save' : 'update'}`,
        {
          ...dataForm,
          menuIdList: [
            ...menuListTreeRef.value.getCheckedKeys(),
            ...menuListTreeRef.value.getHalfCheckedKeys()
          ]
        },
        { method: dataForm.id ? 'put' : 'post' }
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
    } else {
      btnLoading.value = false
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
    <el-form :model="dataForm" ref="dataFormRef" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="授权" prop="menuIdList">
        <el-tree
          ref="menuListTreeRef"
          node-key="id"
          show-checkbox
          :data="menuListTree"
          :default-expanded-keys="expandedKeys"
          :props="{ label: 'name', children: 'children' }"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="dataFormSubmit()"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

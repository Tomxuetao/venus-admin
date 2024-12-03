<script setup>
import { treeDataTranslate } from '@/utils'

import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'
import { useCommonStore } from '@/store'

const emit = defineEmits(['refresh-data-list'])

let btnLoading = ref(false)
let visible = ref(false)
let expandedKeys = ref([1])
let dataForm = reactive({
  id: undefined,
  name: '',
  remark: '',
})
const { menuList } = useCommonStore()

const dataFormRef = ref()
const menuListTreeRef = ref()

let menuListTree = treeDataTranslate([...menuList])

const tempKey = ref(-666666)

const initDialogHandle = (id) => {
  visible.value = true
  btnLoading.value = false
  dataForm.id = id
  if (id) {
    commonApi(`/sys/role/${id}`).then((data) => {
      dataForm.name = data.name
      dataForm.remark = data.remark
      const idx = data.menuIdList.indexOf(tempKey)
      if (idx !== -1) {
        data.menuIdList.splice(idx, data.menuIdList.length - idx)
      }
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
            ...menuListTreeRef.value.getHalfCheckedKeys(),
          ],
        },
        { method: dataForm.id ? 'put' : 'post' },
      )
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refresh-data-list')
        },
      })
    } else {
      btnLoading.value = false
    }
  })
}

const closeDialogHandle = () => {
  visible.value = false
  dataFormRef.value.resetFields()
}

defineExpose({
  init: initDialogHandle,
})
</script>

<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    v-model="visible"
    :destroy-on-close="true"
  >
    <el-form :model="dataForm" ref="dataFormRef" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="授权">
        <el-tree
          ref="menuListTreeRef"
          node-key="id"
          show-checkbox
          :data="menuListTree"
          :default-expanded-keys="expandedKeys"
          :props="{ label: 'name', children: 'children' }"
        ></el-tree>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="closeDialogHandle">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script setup>
import { useCommonStore } from '@/store'
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

let dataForm = reactive({
  name: '',
  remark: '',
  deptIdList: []
})

const commonState = useCommonStore()

const dataFormRef = ref()
let btnLoading = ref(false)

const deptTreeRef = ref()
const deptTreeList = ref([])

const initDialogHandle = async (id) => {
  deptTreeList.value = await commonState.deptTree

  // 获取角色详情
  const data = await commonApi(`/sys/role/${id}`)
  dataForm = Object.assign(dataForm, data)
  deptTreeRef.value.setCheckedKeys(dataForm.deptIdList || [])
}

const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      await commonApi(
        '/data/scope/save',
        {
          id: dataForm.id,
          name: dataForm.name,
          deptIdList: [
            ...deptTreeRef.value.getCheckedKeys(),
            ...deptTreeRef.value.getHalfCheckedKeys()
          ]
        },
        {
          method: 'post'
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
    title="设置数据权限"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="dataFormRef" :model="dataForm" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="dataForm.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="角色备注">
        <el-input v-model="dataForm.remark" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="数据权限">
        <el-tree
          ref="deptTreeRef"
          node-key="id"
          show-checkbox
          :data="deptTreeList"
          :default-expand-all="true"
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
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>

<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
            :data="menuList"
            :props="{ label: 'name',children: 'children' }"
            :default-expanded-keys="expandedKeys"
            ref="menuListTreeRef"
            node-key="menuId"
            show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="closeDialogHandle">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reactive, ref, nextTick, getCurrentInstance } from 'vue'
import { useHttp } from '@/utils/http'
import { treeDataTranslate } from '@/utils'

export default {
  emits: ['refresh-data-list'],

  setup(props, { emit }) {
    const http = useHttp()
    const { ctx } = getCurrentInstance()

    let visible = ref(null)
    let menuList = ref([])
    let expandedKeys = ref([1])
    let dataForm = reactive({
      id: 0,
      roleName: '',
      remark: ''
    })

    const dataFormRef = ref(null)
    const menuListTreeRef = ref(null)
    const dataRule = ref({
      roleName: [{
        required: true,
        message: '角色名称不能为空',
        trigger: 'blur'
      }]
    })
    const tempKey = ref(-666666)

    const init = (id) => {
      dataForm.id = id || 0
      http({
        url: http.adornUrl('/sys/menu/list'),
        method: 'get'
      }).then(data => {
        menuList.value = treeDataTranslate(data, 'menuId')
        console.log(menuList.value)
      }).then(() => {
        visible.value = true
        nextTick(() => {
          if (dataFormRef.value && menuListTreeRef.value) {
            dataFormRef.value.resetFields()
            menuListTreeRef.value.setCheckedKeys([])
          }
        })
      }).then(() => {
        if (dataForm.id) {
          http({
            url: http.adornUrl(`/sys/role/info/${ dataForm.id }`),
            method: 'get',
            params: http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              dataForm.roleName = data.role.roleName
              dataForm.remark = data.role.remark
              const idx = data.role.menuIdList.indexOf(tempKey)
              if (idx !== -1) {
                data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
              }
              menuListTreeRef.value.setCheckedKeys(data.role.menuIdList)
            }
          })
        }
      })
    }

    const dataFormSubmit = () => {
      nextTick(() => {

      })
      debugger
      dataFormRef.value.validate((valid) => {
        if (valid) {
          http({
            url: http.adornUrl(`/sys/role/${ !dataForm.id ? 'save' : 'update' }`),
            method: 'post',
            data: http.adornData({
              roleId: dataForm.id || undefined,
              roleName: dataForm.roleName,
              remark: dataForm.remark,
              menuIdList: [].concat(menuListTreeRef.value.getCheckedKeys(), [tempKey], menuListTreeRef.value.getHalfCheckedKeys())
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              ctx.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  visible.value = false
                  emit('refresh-data-list')
                }
              })
            } else {
              ctx.$message.error(data.msg)
            }
          })
        }
      })
    }

    const closeDialogHandle = () => {
      visible.value = false
      dataFormRef.value.resetFields()
    }

    return {
      tempKey,
      visible,
      menuList,
      dataForm,
      dataRule,
      dataFormRef,
      expandedKeys,

      init,
      dataFormSubmit,
      closeDialogHandle
    }
  }
}
</script>

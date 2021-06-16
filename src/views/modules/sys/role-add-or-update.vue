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
        <el-tree :data="menuList" :props="{ label: 'name',children: 'children' }" :default-expanded-keys="expandedKeys" ref="menuListTreeRef" node-key="menuId" show-checkbox></el-tree>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="closeDialogHandle">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, ref, nextTick, getCurrentInstance } from 'vue'
import { useHttp } from '@/utils/http'
import { treeDataTranslate } from '@/utils'

export default defineComponent({
  emits: ['refresh-data-list'],

  setup(props, { emit }) {
    const validateName = (rule, value, callback) => {
      if (!dataForm.roleName && !/\S/.test(value)) {
        callback(new Error('角色名称不能为空'))
      } else {
        http({
          url: http.adornUrl('/sys/role/validName'),
          method: 'get',
          params: http.adornParams({roleName: value})
        }).then(({data}) => {
          if (dataForm.roleId) {
            data > 1 ? callback(new Error('角色名称不能重复')) : callback()
          } else {
            data ? callback(new Error('角色名称不能重复')) : callback()
          }
        })
      }
    }

    const http = useHttp()
    const { ctx } = getCurrentInstance()

    let btnLoading = ref(false)
    let visible = ref(false)
    let menuList = ref([])
    let expandedKeys = ref([1])
    let dataForm = reactive({
      roleId: undefined,
      roleName: '',
      remark: ''
    })

    const dataFormRef = ref(null)
    const menuListTreeRef = ref(null)

    const dataRule = ref({
      roleName: [{
        required: true,
        trigger: 'blur',
        asyncValidator: validateName
      }]
    })

    const tempKey = ref(-666666)

    const initDialogHandle = (id) => {
      btnLoading.value = false
      dataForm.roleId = id || undefined
      http({
        url: http.adornUrl('/sys/menu/list'),
        method: 'get'
      }).then(({ data }) => {
        menuList.value = treeDataTranslate(data, 'menuId')
      }).then(() => {
        visible.value = true
        nextTick(() => {
          if (dataFormRef.value && menuListTreeRef.value) {
            dataFormRef.value.resetFields()
            menuListTreeRef.value.setCheckedKeys([])
          }
        })
      }).then(() => {
        if (dataForm.roleId) {
          http({
            url: http.adornUrl(`/sys/role/info/${ dataForm.roleId }`),
            method: 'get',
            params: http.adornParams()
          }).then(({ code, data }) => {
            if (code === 200) {
              dataForm.roleName = data.roleName
              dataForm.remark = data.remark
              const idx = data.menuIdList.indexOf(tempKey)
              if (idx !== -1) {
                data.menuIdList.splice(idx, data.menuIdList.length - idx)
              }
              menuListTreeRef.value.setCheckedKeys(data.menuIdList)
            }
          })
        }
      })
    }

    const dataFormSubmit = () => {
      dataFormRef.value.validate((valid) => {
        btnLoading.value = true
        if (valid) {
          http({
            url: http.adornUrl(`/sys/role/${ !dataForm.roleId ? 'save' : 'update' }`),
            method: 'post',
            data: http.adornData({ ...dataForm, menuIdList: [].concat(menuListTreeRef.value.getCheckedKeys(), [tempKey.value], menuListTreeRef.value.getHalfCheckedKeys()) })
          }).then(({ code, msg }) => {
            if (code === 200) {
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
              ctx.$message.error(msg)
            }
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

    return {
      tempKey,
      visible,
      menuList,
      dataForm,
      dataRule,
      btnLoading,
      dataFormRef,
      expandedKeys,
      menuListTreeRef,

      initDialogHandle,
      dataFormSubmit,
      closeDialogHandle
    }
  }
})
</script>

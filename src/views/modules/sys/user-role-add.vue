<script setup>
import useView from '@/hooks/useView'
import { commonApi } from '@/api/common-api'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['refresh-data-list'])

const visible = defineModel({})

const roleList = defineModel('roleList', {
  type: Array,
  default: () => []
})

const userId = defineModel('userId', {
  type: String,
  default: '',
  required: true
})

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/sys/role',
    dataListUrl: '/sys/role/page',
    dataForm: {
      name: undefined
    }
  })
})

const saveUserRoles = async (roleIdList) => {
  ElMessageBox.confirm(`确定对用户[${userId.value}]添加角色?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await commonApi(
      '/sys/user/saveRoles',
      {
        userId: userId.value,
        roleIds: roleIdList
      },
      { method: 'put' }
    )
    emit('refresh-data-list')
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500
    })
    visible.value = false
  })
}
</script>

<template>
  <el-dialog
    class="role-dialog"
    title="新增"
    top="54px"
    width="68%"
    v-model="visible"
    :destroy-on-close="true"
  >
    <div class="mod-user mod-wrap" style="height: 680px">
      <el-form :inline="true" :model="commonView.dataForm">
        <el-form-item>
          <el-input
            v-model="commonView.dataForm.name"
            clearable
            placeholder="角色名称"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="commonView.getDataList()" icon="Search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="commonView.isAuth('sys:user:update')"
            type="primary"
            icon="CircleCheck"
            :disabled="commonView.dataSelections.length === 0"
            @click="
              saveUserRoles(commonView.dataSelections.map((item) => item.id))
            "
          >
            批量分配
          </el-button>
        </el-form-item>
      </el-form>
      <div class="table-wrap">
        <el-table
          border
          style="width: 100%"
          :data="commonView.dataList"
          v-loading="commonView.dataLoading"
          @selection-change="commonView.selectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="50"
            :selectable="(row) => !roleList.find((item) => item.id === row.id)"
          ></el-table-column>
          <el-table-column
            prop="id"
            align="center"
            width="200"
            label="ID"
          ></el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="角色名称"
          ></el-table-column>
          <el-table-column
            prop="remark"
            align="center"
            label="备注"
          ></el-table-column>
          <el-table-column
            prop="createDate"
            align="center"
            width="180"
            label="创建时间"
          ></el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            width="280"
            label="操作"
          >
            <template v-slot="scope">
              <el-button
                v-if="commonView.isAuth('sys:user:update')"
                link
                size="small"
                type="primary"
                @click="saveUserRoles([scope.row.id])"
              >
                分配角色
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <common-pagination v-model="commonView"></common-pagination>
    </div>
  </el-dialog>
</template>

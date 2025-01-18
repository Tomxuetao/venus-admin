<script setup>
import useView from '@/hooks/useView'
import { commonApi } from '@/api/common-api'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['refresh-data-list'])

const visible = defineModel({})

const authedList = defineModel('authedList', {
  type: Array,
  default: () => []
})

const roleId = defineModel('roleId', {
  type: String,
  default: '',
  required: true
})

const commonView = reactive({
  ...useView({
    isPage: true,
    dataListUrl: '/sys/user/list',
    dataForm: {
      username: undefined
    }
  })
})
const statusMap = commonView.dictMap.get('user_status')

const authUsersHandle = async (userIds) => {
  ElMessageBox.confirm(
    `确定对[id=${userIds.join(',')}]进行[取消授权]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await commonApi(
      '/sys/role/saveUsers',
      {
        userIds: userIds,
        roleId: roleId.value
      },
      { method: 'post' }
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
            v-model="commonView.dataForm.username"
            clearable
            placeholder="用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" @click="commonView.getDataList()">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="CircleCheck"
            :disabled="commonView.dataSelections.length === 0"
            @click="
              authUsersHandle(commonView.dataSelections.map((item) => item.id))
            "
          >
            批量授权
          </el-button>
        </el-form-item>
      </el-form>
      <div class="table-wrap">
        <el-table
          border
          :data="commonView.dataList"
          v-loading="commonView.dataLoading"
          @selection-change="commonView.selectionChange"
        >
          <el-table-column
            width="50"
            type="selection"
            align="center"
            :selectable="
              (row) => !authedList.find((item) => item.id === row.id)
            "
          >
          </el-table-column>
          <el-table-column prop="username" align="center" label="用户名">
          </el-table-column>
          <el-table-column prop="email" align="center" label="邮箱">
          </el-table-column>
          <el-table-column prop="mobile" align="center" label="手机号">
          </el-table-column>
          <el-table-column prop="deptName" align="center" label="所属部门">
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template v-slot="scope">
              <el-tag
                size="small"
                :type="commonView.tagTypeMap.get(scope.row.status)"
              >
                {{ statusMap.get(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createDate"
            align="center"
            width="180"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template v-slot="scope">
              <el-button
                v-if="!authedList.find((item) => item.id === scope.row.id)"
                text
                size="small"
                type="primary"
                @click="authUsersHandle([scope.row.id])"
              >
                授权
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <common-pager v-model="commonView"></common-pager>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.el-overlay {
  .el-overlay-dialog {
    .role-dialog {
      :deep(.el-dialog__body) {
        height: 880px !important;
      }
    }
  }
}
</style>

<script setup>
import useView from '@/hooks/useView'
import { commonApi } from '@/api/common-api'
import { ElMessage, ElMessageBox } from 'element-plus'

import AddRoleUser from './role-user-add.vue'

const route = useRoute()

const commonView = reactive({
  ...useView({
    isPage: true,
    dataListUrl: '/sys/role/users',
    dataForm: {
      username: undefined,
      pageNum: 1,
      pageSize: 10,
      roleId: route.params.id
    }
  })
})

const statusMap = commonView.dictMap.get('user_status')

const addUserVisible = ref(false)

const unAuthUsersHandle = (userIds) => {
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
      '/sys/role/deleteUsers',
      {
        roleId: route.params.id,
        userIds: userIds
      },
      { method: 'delete' }
    )
    commonView.getDataList()
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500
    })
  })
}
</script>

<template>
  <div class="mod-user mod-wrap">
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
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:role:save')"
          type="primary"
          icon="Plus"
          @click="() => (addUserVisible = true)"
        >
          添加用户
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:role:save')"
          type="danger"
          icon="Delete"
          :disabled="commonView.dataSelections.length <= 0"
          @click="
            unAuthUsersHandle(commonView.dataSelections.map((item) => item.id))
          "
        >
          批量取消授权
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        ref="tableRef"
        border
        row-key="id"
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
        @selection-change="commonView.selectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="username"
          align="center"
          label="用户名"
        ></el-table-column>
        <el-table-column
          prop="email"
          align="center"
          label="邮箱"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          align="center"
          label="手机号"
        ></el-table-column>
        <el-table-column
          prop="deptName"
          align="center"
          label="所属部门"
        ></el-table-column>
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
        ></el-table-column>
        <el-table-column fixed="right" align="center" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('sys:user:delete')"
              link
              size="small"
              type="danger"
              @click="unAuthUsersHandle([scope.row.id])"
            >
              取消授权
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination v-model="commonView"></common-pagination>
    <add-role-user
      v-if="addUserVisible"
      v-model="addUserVisible"
      :role-id="route.params.id || ''"
      :authed-list="commonView.dataList"
      @refresh-data-list="commonView.getDataList()"
    >
    </add-role-user>
  </div>
</template>

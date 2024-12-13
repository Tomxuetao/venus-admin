<script setup>
import useView from '@/hooks/useView'
import { commonApi } from '@/api/common-api'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()

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

const descList = [
  { label: '用户名', key: 'username' },
  { label: '真实姓名', key: 'realName' },
  { label: '手机号', key: 'mobile' },
  { label: '邮箱', key: 'email' },
  { label: '角色', key: 'roleName' },
  { label: '部门', key: 'deptName' },
  { label: '状态', key: 'status', scopedSlots: { customRender: 'status' } }
]

let userDetail = reactive({})

const getUserDetail = async (userId) => {
  const detail = await commonApi(`/sys/user/${userId}`)

  userDetail = Object.assign(userDetail, detail)
}
getUserDetail(route.params.id)

const updateUserRole = async (roleIdList) => {
  ElMessageBox.confirm(
    `确定对[id=${roleIdList.join(',')}]进行[取消授权]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await commonApi(
      '/sys/user/roles',
      {
        id: route.params.id,
        roleIdList: roleIdList
      },
      { method: 'put' }
    )
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500
    })
    commonView.getDataList()
  })
}
</script>

<template>
  <div class="user-role">
    <div class="user-wrap">
      <div class="user-title">用户信息</div>
      <div class="user-ctx">
        <common-desc
          v-model="userDetail"
          v-model:desc-list="descList"
        ></common-desc>
      </div>
    </div>
    <div class="mod-wrap">
      <el-form :inline="true" :model="commonView.dataForm">
        <el-form-item>
          <el-input
            v-model="commonView.dataForm.name"
            clearable
            placeholder="角色名称"
            @clear="commonView.getDataList()"
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
            type="primary"
            icon="CircleCheck"
            :disabled="commonView.dataSelections.length === 0"
            @click="
              updateUserRole(commonView.dataSelections.map((item) => item.id))
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
                @click="updateUserRole([scope.row.id])"
              >
                分配
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <common-pagination v-model="commonView"></common-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-role {
  height: 100%;
  display: grid;
  grid-gap: 24px 0;
  grid-template-rows: max-content 1fr;

  .user-wrap {
    .user-title {
      font-size: 18px;
      line-height: 32px;
      color: #2c79ff;
      margin-bottom: 12px;
      box-shadow: 0 1px 0 0 rgba(233, 233, 233, 0.5);
    }
  }
}
</style>

<script setup>
import useView from '@/hooks/useView'
import { commonApi } from '@/api/common-api'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddUserRole from '@/views/modules/sys/user-role-add.vue'

const route = useRoute()

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/sys/role',
    dataListUrl: '/sys/user/roles',
    dataForm: {
      name: undefined,
      userId: route.params.id
    }
  })
})

const genderMap = commonView.dictMap.get('gender')
const statusMap = commonView.dictMap.get('user_status')

const descList = [
  { label: '用户名', key: 'username' },
  { label: '真实姓名', key: 'realName' },
  { label: '手机号', key: 'mobile' },
  { label: '邮箱', key: 'email' },
  { label: '性别', key: 'gender', slot: 'gender' },
  { label: '部门', key: 'deptName' },
  { label: '状态', key: 'status', slot: 'status' }
]
const addRoleVisible = ref(false)

let userDetail = reactive({})
const getUserDetail = async (userId) => {
  if (!userDetail.id) {
    const detail = await commonApi(`/sys/user/${userId}`)

    userDetail = Object.assign(userDetail, detail)
  }
}

const removeUserRoles = async (roleIdList) => {
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
      '/sys/user/deleteRoles',
      {
        userId: route.params.id,
        roleIds: roleIdList
      },
      { method: 'delete' }
    )
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500
    })

    commonView.getDataList()
  })
}

watch(
  () => commonView.dataLoading,
  (loading) => {
    if (!loading) {
      getUserDetail(route.params.id)
    }
  }
)
</script>

<template>
  <div class="user-role">
    <div class="user-wrap">
      <div class="user-title">用户信息</div>
      <div class="user-ctx">
        <common-desc v-model="userDetail" :desc-list="descList">
          <template #gender="{ rawValue }">
            {{ genderMap.get(rawValue) }}
          </template>
          <template #status="{ rawValue }">
            <el-tag :type="commonView.tagTypeMap.get(rawValue)">
              {{ statusMap.get(rawValue) }}
            </el-tag>
          </template>
        </common-desc>
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
          <el-button icon="Search" @click="commonView.getDataList()">
            查询
          </el-button>
          <el-button
            v-if="commonView.isAuth('sys:user:update')"
            type="primary"
            icon="Plus"
            @click="() => (addRoleVisible = true)"
          >
            添加角色
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            :disabled="commonView.dataSelections.length === 0"
            @click="
              removeUserRoles(commonView.dataSelections.map((item) => item.id))
            "
          >
            批量移除角色
          </el-button>
        </el-form-item>
      </el-form>
      <div class="table-wrap">
        <el-table
          border
          ref="tableRef"
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
                type="danger"
                @click="removeUserRoles([scope.row.id])"
              >
                移除角色
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <common-pagination v-model="commonView"></common-pagination>
      <add-user-role
        v-if="addRoleVisible"
        v-model="addRoleVisible"
        :user-id="route.params.id || ''"
        :role-list="commonView.dataList"
        @refresh-data-list="commonView.getDataList()"
      >
      </add-user-role>
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

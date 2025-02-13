<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from './client-add-or-update.vue'
import { commonApi } from '@/api/common-api'

const addOrUpdateRef = ref()

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/sys/client/delete',
    dataListUrl: '/sys/client/list',
    dataForm: {
      appName: undefined
    }
  })
})

const appTypeMap = commonView.dictMap.get('app_type')

const statusMap = commonView.dictMap.get('app_status')

const classifyMap = commonView.dictMap.get('app_classify')

const gotoSys = async (id) => {
  const data = await commonApi(`/sys/client/${id}`)
  window.open(
    `/open-api/oauth/authorize?client_id=${data.clientId}&redirect_uri=${data.redirectUri}&response_type=code&token=${sessionStorage.getItem('token')}`
  )
}
</script>

<template>
  <div class="mod-user mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.appName"
          clearable
          placeholder="应用名称"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询</el-button
        >
        <el-button
          v-if="commonView.isAuth('sys:client:save')"
          icon="Plus"
          type="primary"
          @click="commonView.addOrUpdateHandle(undefined)"
        >
          新增
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:client:delete')"
          type="danger"
          icon="Delete"
          @click="commonView.deleteHandle(undefined)"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
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
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column prop="id" align="center" label="ID"></el-table-column>
        <el-table-column
          prop="appName"
          align="center"
          label="应用名称"
        ></el-table-column>
        <el-table-column prop="classify" align="center" label="应用分类">
          <template v-slot="scope">
            {{ classifyMap.get(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="appType" align="center" label="应用类型">
          <template v-slot="scope">
            {{ appTypeMap.get(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="应用状态"
          width="120"
        >
          <template v-slot="scope">
            {{ statusMap.get(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" align="center" label="创建时间">
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('sys:client:update')"
              link
              size="small"
              type="primary"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:client:info')"
              link
              size="small"
              @click="gotoSys(scope.row.id)"
            >
              进入
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:client:delete')"
              link
              size="small"
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pager v-model="commonView"></common-pager>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      ref="addOrUpdateRef"
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      @refreshDataList="commonView.getDataList()"
    ></add-or-update>
  </div>
</template>

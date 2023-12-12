<script setup>
import { downloadExport } from '@/utils'
import { reactive, ref } from 'vue'

import { loginLogListApi, exportLoginLogApi } from '@/api/log-api'

const dataForm = reactive({
  pageNum: 1,
  pageSize: 10,
  status: undefined,
  creatorName: undefined
})

const operationMap = new Map([
  [0, '登录'],
  [1, '退出']
])

const statusMap = new Map([
  [0, '失败'],
  [1, '成功'],
  [2, '账号锁定']
])

let total = ref(0)
let dataList = ref([])
let dataListLoading = ref(false)

const getDataListHandle = async () => {
  dataListLoading.value = true
  const { list, total: count } = await loginLogListApi(dataForm)
  total.value = count
  dataList.value = list
  dataListLoading.value = false
}

getDataListHandle()

const exportExcelHandler = async () => {
  const data = await exportLoginLogApi()
  downloadExport(data)
}

const pageSizeChangeHandle = (pageSize) => {
  dataForm.pageNum = 1
  dataForm.pageSize = pageSize
  getDataListHandle()
}

const pageNumChangeHandle = (pageNum) => {
  dataForm.pageNum = pageNum
  getDataListHandle()
}
</script>

<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.creatorName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status">
          <el-option
            v-for="(key, index) in statusMap.keys()"
            :key="index"
            :label="statusMap.get(key)"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="exportExcelHandler()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      class-name="custom-table"
      border
      height="800px"
      :data="dataList"
      v-loading="dataListLoading"
    >
      <el-table-column
        prop="creatorName"
        align="center"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        prop="operation"
        align="center"
        label="操作类型"
      >
        <template #default="{ row }">
          {{ operationMap.get(row.operation) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        label="状态"
      >
        <template #default="{ row }">
          <el-tag disable-transitions :type="row.status > 0 ? (row.status === 1 ? 'success' : 'warning') : 'danger'">
            {{ statusMap.get(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        label="操作IP"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="userAgent"
        label="用户代理"
        align="center"
        width="240"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        align="center"
        width="180"
        label="创建时间"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="pageSizeChangeHandle"
      @current-change="pageNumChangeHandle"
      :current-page="dataForm.pageNum"
      :page-size="dataForm.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>


<style scoped lang="scss">
.mod-log {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

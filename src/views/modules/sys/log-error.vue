<script setup>
import { downloadExport } from '@/utils'
import { reactive, ref } from 'vue'

import { errorLogListApi, exportErrorLogApi } from '@/api/log-api'

const dataForm = reactive({
  pageNum: 1,
  pageSize: 10
})

const statusMap = new Map([
  [0, '失败'],
  [1, '成功']
])

let total = ref(0)
let dataList = ref([])
let dataListLoading = ref(false)

const getDataListHandle = async () => {
  dataListLoading.value = true
  const { list, total: count } = await errorLogListApi(dataForm)
  total.value = count
  dataList.value = list
  dataListLoading.value = false
}

getDataListHandle()

const exportExcelHandler = async () => {
  const data = await exportErrorLogApi()
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
        prop="requestUri"
        align="center"
        label="请求URI"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="requestMethod"
        label="请求方式"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="requestParams"
        label="请求参数"
        align="center"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        align="center"
        label="操作IP"
      >
      </el-table-column>
      <el-table-column
        prop="userAgent"
        align="center"
        label="用户代理"
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

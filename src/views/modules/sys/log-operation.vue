<script setup>
import useView from '@/hooks/useView'

const statusMap = new Map([
  [0, '失败'],
  [1, '成功']
])

const commonView = reactive({
  ...useView({
    isPage: true,
    dataListUrl: '/sys/log/operation/page',
    exportUrl: '/sys/log/operation/export',
    dataForm: {
      status: undefined
    }
  })
})

const logStatusMap = commonView.dictMap.get('log_status')
</script>

<template>
  <div class="mod-log mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-select
          v-model="commonView.dataForm.status"
          placeholder="请选择状态"
          style="width: 186px"
        >
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
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询</el-button
        >
        <el-button
          icon="Download"
          type="success"
          @click="commonView.exportHandle()"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        class-name="custom-table"
        border
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
      >
        <el-table-column prop="creatorName" align="center" label="用户名">
        </el-table-column>
        <el-table-column prop="operation" align="center" label="操作类型">
        </el-table-column>
        <el-table-column
          prop="requestUri"
          align="center"
          label="请求URI"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="requestMethod" label="请求方式" align="center">
        </el-table-column>
        <el-table-column
          prop="requestParams"
          label="请求参数"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="requestTime" align="center" label="请求时长">
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template #default="scope">
            <el-tag :type="commonView.tagTypeMap.get(scope.row.status)">
              {{ logStatusMap.get(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" align="center" label="IP"> </el-table-column>
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
    </div>
    <common-pagination v-model="commonView"></common-pagination>
  </div>
</template>

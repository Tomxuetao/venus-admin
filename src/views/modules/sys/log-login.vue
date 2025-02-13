<script setup>
import useView from '@/hooks/useView'

const commonView = reactive({
  ...useView({
    isPage: true,
    dataListUrl: '/sys/log/login/page',
    exportUrl: '/sys/log/login/export',
    dataForm: {
      status: undefined,
      creatorName: undefined
    }
  })
})
const operationMap = commonView.dictMap.get('login_logout')

const statusMap = commonView.dictMap.get('login_log_status')
</script>

<template>
  <div class="mod-log mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          clearable
          placeholder="用户名"
          v-model="commonView.dataForm.creatorName"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          placeholder="状态"
          style="width: 186px"
          @change="commonView.getDataList()"
          v-model="commonView.dataForm.status"
        >
          <el-option
            v-for="([key, value], index) in statusMap"
            :key="index"
            :value="key"
            :label="value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="commonView.getDataList()"
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
          <template #default="scope">
            {{ operationMap.get(scope.row.operation) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template #default="scope">
            <el-tag :type="commonView.tagTypeMap.get(scope.row.status)">
              {{ statusMap.get(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" align="center"> </el-table-column>
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
    </div>
    <common-pager v-model="commonView"></common-pager>
  </div>
</template>

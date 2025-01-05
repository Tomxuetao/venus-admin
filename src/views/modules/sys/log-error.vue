<script setup>
import useView from '@/hooks/useView'

const commonView = reactive({
  ...useView({
    isPage: true,
    dataListUrl: '/sys/log/error/page',
    exportUrl: '/sys/log/error/export',
    dataForm: {
      status: undefined
    }
  })
})
</script>

<template>
  <div class="mod-log mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
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

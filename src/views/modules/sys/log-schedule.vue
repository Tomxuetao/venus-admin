<script setup>
import useView from '@/hooks/useView'
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'

const commonView = reactive({
  ...useView({
    isPage: true,
    dataListUrl: '/sys/scheduleLog/page',
    exportUrl: '/sys/log/error/export',
    dataForm: {
      jobId: null,
      beanName: undefined
    }
  })
})

const statusMap = commonView.dictMap.get('log_status')

// 失败信息
const showErrorHandle = async (id) => {
  const data = await commonApi(`/sys/scheduleLog/info/${id}`)
  ElMessage.error(data)
}
</script>

<template>
  <div class="mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item prop="jobId">
        <el-input
          v-model="commonView.dataForm.jobId"
          placeholder="任务ID"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="beanName">
        <el-input
          v-model="commonView.dataForm.beanName"
          placeholder="bean名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        :data="commonView.dataList"
        border
        v-loading="commonView.dataLoading"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          align="center"
          width="200"
          label="日志ID"
        ></el-table-column>
        <el-table-column
          prop="jobId"
          align="center"
          width="200"
          label="任务ID"
        ></el-table-column>
        <el-table-column
          prop="beanName"
          align="center"
          label="bean名称"
        ></el-table-column>
        <el-table-column
          prop="params"
          align="center"
          label="参数"
        ></el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template v-slot="scope">
            <el-tag
              style="cursor: pointer"
              :type="commonView.tagTypeMap.get(scope.row.status)"
              @click="showErrorHandle(scope.row.id)"
            >
              {{ statusMap.get(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="times"
          align="center"
          label="耗时(单位: 毫秒)"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="执行时间"
        ></el-table-column>
      </el-table>
    </div>
    <common-pagination v-model="commonView"></common-pagination>
  </div>
</template>

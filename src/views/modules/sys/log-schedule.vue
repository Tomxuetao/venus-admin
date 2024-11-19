<script setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { commonApi } from '@/api/common-api';
import useCommonView from '@/hooks/useCommonView';

const commonView = reactive({
  ...useCommonView({
    isPage: true,
    dataListUrl: '/sys/scheduleLog/page',
    exportUrl: '/sys/log/error/export',
    dataForm: {
      jobId: null,
      beanName: undefined,
    },
  }),
});

// 失败信息
const showErrorHandle = async (id) => {
  const data = await commonApi(`/sys/scheduleLog/info/${id}`);
  ElMessage.error(data);
};
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
            <el-tag v-if="scope.row.status === 1" size="small">成功</el-tag>
            <el-tag
              v-else
              @click="showErrorHandle(scope.row.id)"
              size="small"
              type="danger"
              style="cursor: pointer"
            >
              失败
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
    <el-pagination
      @size-change="commonView.pageSizeChange"
      @current-change="commonView.pageNumChange"
      :current-page="commonView.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="commonView.pageSize"
      :total="commonView.total"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

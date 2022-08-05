<template>
  <el-dialog title="日志列表" :close-on-click-modal="false" v-model="visible" width="75%">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.jobId" placeholder="任务ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" height="460" style="width: 100%;">
      <el-table-column prop="logId" align="center" width="80" label="日志ID"></el-table-column>
      <el-table-column prop="jobId" align="center" width="80" label="任务ID"></el-table-column>
      <el-table-column prop="beanName" align="center" label="bean名称"></el-table-column>
      <el-table-column prop="params" align="center" label="参数"></el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small">成功</el-tag>
          <el-tag v-else @click="showErrorHandle(scope.row.logId)" size="small" type="danger" style="cursor: pointer;">
            失败
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="times" align="center" label="耗时(单位: 毫秒)"></el-table-column>
      <el-table-column prop="createTime" align="center" width="180" label="执行时间"></el-table-column>
    </el-table>
    <el-pagination
        @size-change="pageSizeChangeHandle"
        @current-change="pageNumChangeHandle"
        :current-page="searchForm.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useHttp } from '@/utils/http'

const http = useHttp()

const total = ref(0)
const visible = ref()
const dataList = ref([])
const searchForm = reactive({
  jobId: null,
  pageNum: 1,
  pageSize: 10
})

const dataListLoading = ref(false)

const initDialogHandle = () => {
  visible.value = true
  getDataListHandle()
}

// 获取数据列表
let isSizeChange = false
const getDataListHandle = () => {
  dataListLoading.value = true
  http({
    url: http.adornUrl('/sys/scheduleLog/list'),
    method: 'get',
    params: http.adornParams(searchForm)
  }).then(({ code, data }) => {
    isSizeChange = false
    if (code === 200) {
      dataList.value = data.list
      total.value = data.total
    } else {
      dataList.value = []
      total.value = 0
    }
    dataListLoading.value = false
  })
}

// 失败信息
const showErrorHandle = (id) => {
  http({
    url: http.adornUrl(`/sys/scheduleLog/info/${id}`),
    method: 'get',
    params: http.adornParams()
  }).then(({ code, data, msg }) => {
    if (code === 200) {
      ElMessage.error(data)
    } else {
      ElMessage.error(data.error)
    }
  })
}

// 每页数
const pageSizeChangeHandle = (pageSize) => {
  isSizeChange = true
  searchForm.pageNum = 1
  searchForm.pageSize = pageSize
  getDataListHandle()
}

// 当前页
const pageNumChangeHandle = (pageNum) => {
  if (!isSizeChange) {
    searchForm.pageNum = pageNum
    getDataListHandle()
  }
}

defineExpose({
  initDialogHandle
})
</script>

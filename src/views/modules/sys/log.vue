<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名／用户操作" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
      <el-table-column prop="id" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="username" align="center" label="用户名"></el-table-column>
      <el-table-column prop="operation" align="center" label="用户操作"></el-table-column>
      <el-table-column prop="method" align="center" width="150" :show-overflow-tooltip="true" label="请求方法"></el-table-column>
      <el-table-column prop="params" align="center" width="150" :show-overflow-tooltip="true" label="请求参数"></el-table-column>
      <el-table-column prop="time" align="center" label="执行时长(毫秒)"></el-table-column>
      <el-table-column prop="ip" align="center" width="150" label="IP地址"></el-table-column>
      <el-table-column prop="createDate" align="center" width="180" label="创建时间"></el-table-column>
    </el-table>
    <el-pagination
        @size-change="pageSizeChangeHandle"
        @current-change="pageNumChangeHandle"
        :current-page="dataForm.pageNum"
        :page-size="dataForm.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useHttp } from '@/utils/http'

export default {
  setup() {
    const http = useHttp()

    const dataForm = reactive({
      key: null,
      pageSize: 10,
      pageNum: 1
    })

    let total = ref(0)
    let dataList = ref([])
    let dataListLoading = ref(false)

    let isSizeChange = false

    const getDataListHandle = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/log/list'),
        method: 'get',
        params: http.adornParams(dataForm)
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

    getDataListHandle()

    // 每页数
    const pageSizeChangeHandle = (pageSize) => {
      isSizeChange = true
      dataForm.pageNum = 1
      dataForm.pageSize = pageSize
      getDataListHandle()
    }

    // 当前页
    const pageNumChangeHandle = (pageNum) => {
      if (!isSizeChange) {
        dataForm.pageNum = pageNum
        getDataListHandle()
      }
    }

    return {
      total,
      dataList,
      dataForm,
      dataListLoading,

      getDataListHandle,
      pageSizeChangeHandle,
      pageNumChangeHandle
    }
  }
}
</script>

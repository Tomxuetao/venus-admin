<template>
  <el-dialog
      title="日志列表"
      :close-on-click-modal="false"
      v-model:visible="visible"
      width="75%">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="任务ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        height="460"
        style="width: 100%;">
      <el-table-column
          prop="logId"
          header-align="center"
          align="center"
          width="80"
          label="日志ID">
      </el-table-column>
      <el-table-column
          prop="jobId"
          header-align="center"
          align="center"
          width="80"
          label="任务ID">
      </el-table-column>
      <el-table-column
          prop="beanName"
          header-align="center"
          align="center"
          label="bean名称">
      </el-table-column>
      <el-table-column
          prop="params"
          header-align="center"
          align="center"
          label="参数">
      </el-table-column>
      <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small">成功</el-tag>
          <el-tag v-else @click="showErrorInfo(scope.row.logId)" size="small" type="danger" style="cursor: pointer;">
            失败
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="times"
          header-align="center"
          align="center"
          label="耗时(单位: 毫秒)">
      </el-table-column>
      <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          width="180"
          label="执行时间">
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="dataForm.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="dataForm.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-dialog>
</template>

<script>
import { ref, reactive } from 'vue'
import { useHttp } from '@/utils/http'

export default {
  setup(props, cxt) {
    const http = useHttp()

    const total = ref(0)
    const visible = ref()
    const dataList = ref([])
    const dataForm = reactive({
      jobId: null,
      pageNum: 1,
      pageSize: 10
    })

    const dataListLoading = ref(false)

    const init = () => {
      visible.value = true
      getDataList()
    }

    // 获取数据列表
    const getDataList = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/scheduleLog/list'),
        method: 'get',
        params: http.adornParams(dataForm)
      }).then((code, page, msg) => {
        if (code === 200) {
          dataList.value = page.list
          total.value = page.total
        } else {
          dataList.value = []
          total.value = 0
        }
        dataListLoading.value = false
      })
    }

    // 失败信息
    const showErrorInfo = (id) => {
      http({
        url: http.adornUrl(`/sys/scheduleLog/info/${id}`),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$alert(data.log.error)
        } else {
          this.$message.error(data.msg)
        }
      })
    }

    // 每页数
    const sizeChangeHandle = (val) => {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    }

    // 当前页
    const currentChangeHandle = (val) => {
      this.pageIndex = val
      this.getDataList()
    }

    return {
      total,
      visible,
      dataList,
      dataForm,
      dataListLoading,

      init,
      getDataList,
      showErrorInfo,
      sizeChangeHandle,
      currentChangeHandle,

    }
  }
}
</script>

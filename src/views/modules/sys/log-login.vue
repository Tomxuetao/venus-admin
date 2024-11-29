<script setup>
import useView from '@/hooks/useView'

const operationMap = new Map([
  [0, '登录'],
  [1, '退出'],
])

const statusMap = new Map([
  [0, '失败'],
  [1, '成功'],
  [2, '账号锁定'],
])

const commonView = reactive({
  ...useView({
    isPage: true,
    dataListUrl: '/sys/log/login/page',
    exportUrl: '/sys/log/login/export',
    dataForm: {
      status: undefined,
      creatorName: undefined,
    },
  }),
})
</script>

<template>
  <div class="mod-log mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.creatorName"
          placeholder="用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="commonView.dataForm.status"
          clearable
          placeholder="状态"
          style="width: 186px"
          @change="commonView.getDataList()"
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
        <el-button @click="commonView.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.exportHandle()">导出</el-button>
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
          <template #default="{ row }">
            {{ operationMap.get(row.operation) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template #default="{ row }">
            <el-tag
              disable-transitions
              :type="
                row.status > 0
                  ? row.status === 1
                    ? 'success'
                    : 'warning'
                  : 'danger'
              "
            >
              {{ statusMap.get(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="操作IP" align="center">
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
    </div>
    <el-pagination
      @size-change="commonView.pageSizeChange"
      @current-change="commonView.pageNumChange"
      :current-page="commonView.pageNum"
      :page-size="commonView.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="commonView.total"
      background
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

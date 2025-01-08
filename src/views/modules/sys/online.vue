<script setup>
import useView from '@/hooks/useView'

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteIsBatch: true,
    deleteUrl: '/sys/online/logout',
    dataListUrl: '/sys/online/list',
    dataForm: {
      username: undefined,
      pageNum: 1,
      pageSize: 10
    }
  })
})
</script>

<template>
  <div class="mod-user mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.username"
          clearable
          placeholder="用户名"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询</el-button
        >
        <el-button
          v-if="commonView.isAuth('sys:online:logout')"
          type="danger"
          icon="Delete"
          @click="commonView.deleteHandle(undefined)"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量强退
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        ref="tableRef"
        border
        row-key="id"
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
        @selection-change="commonView.selectionChange"
      >
        <el-table-column type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column
          prop="sessionId"
          align="center"
          label="会话编号"
          width="320"
        >
        </el-table-column>
        <el-table-column prop="username" align="center" label="用户名">
        </el-table-column>
        <el-table-column prop="ip" align="center" label="主机">
        </el-table-column>
        <el-table-column prop="browser" align="center" label="浏览器">
        </el-table-column>
        <el-table-column prop="os" align="center" label="操作系统">
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="登录时间"
        >
        </el-table-column>
        <el-table-column
          prop="updateDate"
          align="center"
          width="180"
          label="更新时间"
        >
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('sys:online:logout')"
              link
              size="small"
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              强退
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination v-model="commonView"></common-pagination>
  </div>
</template>

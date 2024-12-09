<script setup>
import useView from '@/hooks/useView'

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/sys/gen/delete',
    dataListUrl: '/sys/gen/list',
    dataForm: {
      tableName: undefined
    }
  })
})
</script>

<template>
  <div class="mod-user mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          clearable
          v-model="commonView.dataForm.tableName"
          placeholder="表名"
          @clear="commonView.getDataList()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()">查询</el-button>
        <el-button
          v-if="commonView.isAuth('sys:user:delete')"
          type="danger"
          @click="commonView.deleteHandle(undefined)"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        :data="commonView.dataList"
        border
        v-loading="commonView.dataLoading"
        @selection-change="commonView.selectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="tableName"
          align="center"
          label="表名"
        ></el-table-column>
        <el-table-column
          prop="tableComment"
          align="center"
          label="表说明"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="创建时间"
        ></el-table-column>
        <el-table-column fixed="right" align="center" width="280" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('sys:user:update')"
              link
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
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

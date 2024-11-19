<template>
  <div class="mod-role mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.name"
          placeholder="角色名称"
          clearable
          @clear="commonView.getDataList()"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('sys:role:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          v-if="isAuth('sys:role:delete')"
          type="danger"
          @click="commonView.deleteHandle()"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        border
        style="width: 100%"
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
        @selection-change="commonView.selectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="id"
          align="center"
          width="200"
          label="ID"
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="创建时间"
        ></el-table-column>
        <el-table-column fixed="right" align="center" width="150" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="isAuth('sys:role:update')"
              link
              size="small"
              type="primary"
              @click="addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="isAuth('sys:role:delete')"
              link
              size="small"
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList"
    >
    </add-or-update>
  </div>
</template>

<script setup>
import AddOrUpdate from './role-add-or-update.vue'
import {
 ref, reactive, nextTick 
} from 'vue'
import { isAuth } from '@/utils'
import useCommonView from '@/hooks/useCommonView'

const commonView = reactive({
  ...useCommonView({
    isPage: true,
    deleteUrl: '/sys/role',
    dataListUrl: '/sys/role/page',
    dataForm: {
      name: undefined
    }
  })
})

let addOrUpdateRef = ref()
let addOrUpdateVisible = ref(false)

const addOrUpdateHandle = (id = undefined) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.initDialogHandle(id)
  })
}
</script>

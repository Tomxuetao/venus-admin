<script setup>
import { isAuth } from '@/utils'
import useCommonView from '@/hooks/useCommonView'
import AddOrUpdate from '@/views/modules/sys/params-add-or-update.vue'

const commonView = reactive({
  ...useCommonView({
    deleteIsBatch: false,
    deleteUrl: '/sys/params',
    dataListUrl: '/sys/params/page',
    dataForm: {
      paramCode: undefined
    }
  })
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id = undefined) => {
  addOrUpdateRef.value.init(id)
}
</script>

<template>
  <div class="mod-params mod-wrap">
    <el-form
      :inline="true"
      :model="commonView.dataForm"
      @keyup.enter="commonView.getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.paramCode"
          placeholder="编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isAuth('sys:params:save')"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isAuth('sys:params:delete')"
          type="danger"
          @click="commonView.deleteHandle()"
          :disabled="commonView.dataSelections.length <= 0"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        v-loading="commonView.dataLoading"
        :data="commonView.dataList"
        border
        @selection-change="commonView.dataSelections"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="paramCode"
          label="编码"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="paramValue"
          label="值"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template v-slot="scope">
            <el-button
              v-if="isAuth('sys:params:update')"
              type="primary"
              link
              @click="addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="isAuth('sys:params:delete')"
              type="primary"
              link
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :current-page="commonView.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="commonView.pageSize"
      :total="commonView.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="commonView.pageSizeChange"
      @current-change="commonView.pageNumChange"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList"
    ></add-or-update>
  </div>
</template>

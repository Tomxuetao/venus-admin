<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from '@/views/modules/sys/params-add-or-update.vue'

const commonView = reactive({
  ...useView({
    deleteIsBatch: false,
    deleteUrl: '/sys/params',
    dataListUrl: '/sys/params/page',
    dataForm: {
      paramCode: undefined
    }
  })
})
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
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询</el-button
        >
        <el-button
          v-if="commonView.isAuth('sys:params:save')"
          icon="Plus"
          type="primary"
          @click="commonView.addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:params:delete')"
          type="danger"
          icon="Delete"
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
              v-if="commonView.isAuth('sys:params:update')"
              link
              size="small"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:params:delete')"
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
    <common-pager v-model="commonView"></common-pager>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList()"
    ></add-or-update>
  </div>
</template>

<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from './dept-add-or-update.vue'

const commonView = reactive({
  ...useView({
    isPage: false,
    deleteIsBatch: false,
    deleteUrl: '/sys/dept',
    dataListUrl: '/sys/dept/list',
    dataForm: {}
  })
})
</script>

<template>
  <div class="mod-menu mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          icon="Plus"
          type="primary"
          v-if="commonView.isAuth('sys:dept:save')"
          @click="commonView.addOrUpdateHandle(undefined)"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        :data="commonView.dataList"
        row-key="id"
        border
        :default-expand-all="true"
      >
        <el-table-column prop="name" min-width="150" label="名称">
        </el-table-column>
        <el-table-column prop="parentName" align="center" label="上级部门">
        </el-table-column>
        <el-table-column width="120" prop="sort" align="center" label="排序号">
        </el-table-column>
        <el-table-column fixed="right" align="center" width="150" label="操作">
          <template v-slot="scope">
            <el-button
              link
              size="small"
              v-if="commonView.isAuth('sys:dept:update')"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              v-if="commonView.isAuth('sys:dept:save')"
              @click="commonView.addOrUpdateHandle(undefined, scope.row.id)"
            >
              新增
            </el-button>
            <el-button
              link
              size="small"
              type="danger"
              v-if="commonView.isAuth('sys:dept:delete')"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      ref="addOrUpdateRef"
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      @refreshDataList="commonView.getDataList()"
    >
    </add-or-update>
  </div>
</template>

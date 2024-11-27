<script setup>
import useCommonView from '@/hooks/useCommonView'
import AddOrUpdate from './dept-add-or-update.vue'

const commonView = reactive({
  ...useCommonView({
    isPage: false,
    deleteIsBatch: false,
    deleteUrl: '/sys/dept',
    dataListUrl: '/sys/dept/list',
    dataForm: {
      name: undefined
    }
  })
})

let addOrUpdateVisible = ref(false)

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(id)
  })
}
</script>

<template>
  <div class="mod-menu mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle(undefined)"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="commonView.dataList" row-key="id" border>
      <el-table-column prop="name" min-width="150" label="名称">
      </el-table-column>
      <el-table-column prop="parentName" align="center" label="上级部门">
      </el-table-column>
      <el-table-column width="120" prop="sort" align="center" label="排序号">
      </el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button link size="small" @click="addOrUpdateHandle(scope.row.id)">
            修改
          </el-button>
          <el-button
            link
            size="small"
            @click="commonView.deleteHandle(scope.row.id)"
            style="color: #f56c6c"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList()"
    >
    </add-or-update>
  </div>
</template>

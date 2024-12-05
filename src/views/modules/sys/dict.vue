<script setup>
import { buildTree } from '@/utils'
import useView from '@/hooks/useView'

const commonView = reactive({
  ...useView({
    isPage: false,
    deleteUrl: '/sys/dict',
    dataListUrl: '/sys/dict/list',
  }),
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id = undefined) => {
  addOrUpdateRef.value.init(id)
}
</script>

<template>
  <div class="mod-dict mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          v-if="commonView.isAuth('sys:dict:save')"
          type="primary"
          @click="addOrUpdateHandle(undefined)"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        v-loading="commonView.dataLoading"
        border
        row-key="id"
        :data="buildTree(commonView.dataList, '0')"
      >
        <el-table-column prop="label" label="字典标签"> </el-table-column>
        <el-table-column
          prop="value"
          label="字典值"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          sortable="custom"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          sortable="custom"
          header-align="center"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('sys:dict:update')"
              link
              type="primary"
              @click="addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:dict:delete')"
              link
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <!--    <add-or-update ref="addOrUpdateRef" @refreshDataList="commonView.getDataList"></add-or-update>-->
  </div>
</template>

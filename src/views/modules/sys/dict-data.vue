<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from './dict-add-or-update.vue'

const route = useRoute()

const commonView = reactive({
  ...useView({
    isPage: false,
    deleteUrl: '/sys/dict',
    dataListUrl: '/sys/dict/list',
    dataForm: {
      pid: route.params.id
    }
  })
})

const statusMap = commonView.dictMap.get('dict_status')
</script>

<template>
  <div class="mod-dict mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          v-if="commonView.isAuth('sys:dict:save')"
          icon="Plus"
          type="primary"
          @click="commonView.addOrUpdateHandle(undefined, route.params.id)"
        >
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          icon="Delete"
          @click="commonView.deleteHandle(undefined)"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        border
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
        @selection-change="commonView.selectionChange"
      >
        <el-table-column type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column prop="label" label="字典标签"></el-table-column>
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
          prop="status"
          label="状态"
          header-align="center"
          align="center"
        >
          <template v-slot="scope">
            <el-tag
              size="small"
              :type="commonView.tagTypeMap.get(scope.row.status)"
            >
              {{ statusMap.get(scope.row.status) }}
            </el-tag>
          </template>
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
              @click="
                commonView.addOrUpdateHandle(scope.row.id, route.params.id)
              "
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
    <add-or-update
      ref="addOrUpdateRef"
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      @refreshDataList="commonView.getDataList"
    ></add-or-update>
  </div>
</template>

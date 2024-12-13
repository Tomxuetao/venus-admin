<script setup>
import { buildTree } from '@/utils'
import useView from '@/hooks/useView'
import AddOrUpdate from './dict-add-or-update.vue'

const router = useRouter()

const commonView = reactive({
  ...useView({
    isPage: false,
    deleteUrl: '/sys/dict',
    dataListUrl: '/sys/dict/list'
  })
})

const statusMap = commonView.dictMap.get('dict_status')

const gotoDictData = (data) => {
  if (commonView.isAuth('sys:dict:data')) {
    router.push({ name: 'sys-dict-data', params: { id: data.id } })
  }
}
</script>

<template>
  <div class="mod-dict mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          v-if="commonView.isAuth('sys:dict:save')"
          icon="Plus"
          type="primary"
          @click="commonView.addOrUpdateHandle(undefined)"
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
        <el-table-column prop="label" label="字典标签"></el-table-column>
        <el-table-column
          prop="value"
          label="字典值"
          header-align="center"
          align="center"
        >
          <template v-slot="scope">
            <el-text
              v-if="scope.row.pid === '0'"
              type="primary"
              style="cursor: pointer"
              @click="gotoDictData(scope.row)"
            >
              {{ scope.row.value }}
            </el-text>
            <template v-else>{{ scope.row.value }}</template>
          </template>
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
              size="small"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:dict:delete')"
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList()"
    >
    </add-or-update>
  </div>
</template>

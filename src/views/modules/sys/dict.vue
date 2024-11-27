<script setup>
import { buildTree, isAuth } from '@/utils'
import useCommonView from '@/hooks/useCommonView'

const commonView = reactive({
  ...useCommonView({
    deleteUrl: '/sys/dict',
    dataListUrl: '/sys/dict/page',
    dataForm: {
      value: undefined,
      label: undefined,
    },
  }),
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id = undefined) => {
  addOrUpdateRef.value.init(id)
}
</script>

<template>
  <div class="mod-dict mod-wrap">
    <el-form
      :inline="true"
      :model="commonView.dataForm"
      @keyup.enter="commonView.getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.value"
          placeholder="字典值"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.label"
          placeholder="字典标签"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isAuth('sys:dict:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isAuth('sys:dict:delete')"
          type="danger"
          @click="commonView.deleteHandle()"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        v-loading="commonView.dataLoading"
        border
        row-key="id"
        style="width: 100%"
        :data="buildTree(commonView.dataList, '0')"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
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
              v-if="isAuth('sys:dict:update')"
              link
              type="primary"
              @click="addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="isAuth('sys:dict:delete')"
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

    <el-pagination
      :current-page="commonView.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="commonView.pageSize"
      :total="commonView.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="commonView.pageSizeChange"
      @current-change="commonView.pageNumChange"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <!--    <add-or-update ref="addOrUpdateRef" @refreshDataList="commonView.getDataList"></add-or-update>-->
  </div>
</template>

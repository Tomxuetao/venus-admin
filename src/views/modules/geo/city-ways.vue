<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from './city-way-add-or-update.vue'

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/city/site/delete',
    dataListUrl: '/city/site/page',
    importUrl: '/city/site/import',
    dataForm: {
      name: undefined,
      area: undefined
    }
  })
})

const showImportDialog = async () => {
  const fileInput = document.getElementById('fileInput')
  fileInput.click()
  fileInput.onchange = async () => {
    const file = fileInput.files[0]
    if (file) {
      commonView.importHandle(file)
    }
  }
}
</script>

<template>
  <div class="layers-mod mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.name"
          clearable
          placeholder="点位名称"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.area"
          clearable
          placeholder="所属区县"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询</el-button
        >
        <el-button
          v-if="commonView.isAuth('city:site:import')"
          type="success"
          icon="DocumentAdd"
          @click="showImportDialog"
        >
          导入Excel
          <input
            style="display: none"
            id="fileInput"
            type="file"
            accept=".xls,.xlsx"
          />
        </el-button>
        <el-button
          v-if="commonView.isAuth('geo:layer:delete')"
          icon="Delete"
          type="danger"
          :disabled="commonView.dataSelections.length <= 0"
          @click="commonView.deleteHandle()"
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
        <el-table-column
          prop="name"
          align="center"
          width="180"
          label="点位名称"
        >
        </el-table-column>
        <el-table-column
          prop="area"
          align="center"
          label="城区"
        ></el-table-column>
        <el-table-column
          prop="street"
          align="center"
          label="街道"
        ></el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="详细地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="busHours"
          align="center"
          label="营业时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="type"
          align="center"
          label="业态类型"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="dist"
          align="center"
          label="业态分布"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="intro"
          align="center"
          label="点位介绍"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="160"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column fixed="right" align="center" width="240" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('city:site:update')"
              link
              size="small"
              type="primary"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="commonView.isAuth('city:site:delete')"
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
    <add-or-update
      ref="addOrUpdateRef"
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      @refreshDataList="commonView.getDataList()"
    >
    </add-or-update>
  </div>
</template>

<style scoped lang="scss"></style>

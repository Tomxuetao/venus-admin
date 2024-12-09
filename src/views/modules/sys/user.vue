<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from './user-add-or-update.vue'
import { venusOssServer } from '@/utils/http'

const addOrUpdateRef = ref()

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/sys/user/delete',
    dataListUrl: '/sys/user/list',
    exportUrl: '/sys/user/export',
    importUrl: '/sys/user/import',
    dataForm: {
      username: undefined
    }
  })
})
const addOrUpdateVisible = ref(false)

// 新增 / 修改
const addOrUpdateHandle = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(id)
  })
}

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

const downloadHandle = () => {
  location.href = `${venusOssServer}/upload/template/导入用户模版.xlsx`
}
</script>

<template>
  <div class="mod-user mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.username"
          placeholder="用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()">查询</el-button>
        <el-button
          v-if="commonView.isAuth('sys:user:save')"
          type="primary"
          @click="addOrUpdateHandle(undefined)"
        >
          新增
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:user:delete')"
          type="danger"
          @click="commonView.deleteHandle(undefined)"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
        </el-button>
        <el-button type="primary" icon="Download" @click="downloadHandle">
          导入模版
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:user:export')"
          type="warning"
          icon="Document"
          @click="commonView.exportHandle()"
        >
          导出Excel
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:user:import')"
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
      </el-form-item>
    </el-form>
    <el-table
      :data="commonView.dataList"
      border
      v-loading="commonView.dataLoading"
      @selection-change="commonView.selectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="用户名"
      ></el-table-column>
      <el-table-column
        prop="email"
        align="center"
        label="邮箱"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        align="center"
        label="手机号"
      ></el-table-column>
      <el-table-column
        prop="deptName"
        align="center"
        label="所属部门"
      ></el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger"
            >禁用
          </el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        align="center"
        width="180"
        label="创建时间"
      ></el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button
            v-if="commonView.isAuth('sys:user:update')"
            link
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
          >
            修改
          </el-button>
          <el-button
            v-if="commonView.isAuth('sys:user:delete')"
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
      @refreshDataList="commonView.getDataList()"
    ></add-or-update>
  </div>
</template>

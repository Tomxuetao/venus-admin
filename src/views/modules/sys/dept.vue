<template>
  <div class="mod-menu">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle(undefined)">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" row-key="id" border>
      <el-table-column
        prop="name" min-width="150"
        label="名称"
      >
      </el-table-column>
      <el-table-column
        prop="parentName"
        align="center"
        label="上级部门"
      >
      </el-table-column>
      <el-table-column
        width="120"
        prop="sort"
        align="center"
        label="排序号"
      >
      </el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button
            link size="small"
            @click="addOrUpdateHandle(scope.row.id)">
            修改
          </el-button>
          <el-button
            link size="small"
            @click="deleteHandle(scope.row.id)"
            style="color: #f56c6c;">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataListHandle"></add-or-update>
  </div>
</template>

<script setup>
import { deleteSysDeptApi, sysDeptListApi } from '@/api/dept-api'
import AddOrUpdate from './dept-add-or-update.vue'

import { treeDataTranslate } from '@/utils'
import { ref, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'


let dataList = ref([])
let dataListLoading = ref(false)
let addOrUpdateVisible = ref(false)

const getDataListHandle = () => {
  dataListLoading.value = true
  sysDeptListApi().then((data) => {
    dataList.value = treeDataTranslate(data)
    dataListLoading.value = false
  }).catch(() => {
    dataListLoading.value = false
  })
}

getDataListHandle()

const deleteHandle = (id) => {
  ElMessageBox.confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSysDeptApi({ id: id }).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getDataListHandle()
        }
      })
    })
  })
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.initDialogHandle(id)
  })
}
</script>

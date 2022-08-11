<template>
  <div class="mod-menu">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle(undefined)">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" row-key="id" border style="width: 100%;">
      <el-table-column prop="name" min-width="150" label="名称"></el-table-column>
      <el-table-column prop="parentName" align="center" width="120" label="上级菜单"></el-table-column>
      <el-table-column align="center" label="图标">
        <template v-slot="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" align="center" label="类型">
        <template v-slot="scope">
          <el-tag size="small" :type="scope.row.type ? 'success' : ''">{{ menuTypeMap.get(scope.row.type)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="orderNum"
          align="center"
          label="排序号">
      </el-table-column>
      <el-table-column
          prop="url"
          align="center"
          width="150"
          label="菜单URL"
          :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
          prop="permissions"
          align="center"
          width="150"
          label="授权标识"
          :show-overflow-tooltip="true">
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
import { sysMenuDeleteApi, sysMenuListApi } from '@/api/menu-api'
import AddOrUpdate from './menu-add-or-update.vue'

import { treeDataTranslate, isAuth } from '@/utils'

import { ref, nextTick } from 'vue'

import { ElMessageBox, ElMessage } from 'element-plus'

const menuTypeMap = new Map([
  [0, '菜单'],
  [1, '按钮']
])

let dataList = ref([])
let dataListLoading = ref(false)
let addOrUpdateVisible = ref(false)

const getDataListHandle = () => {
  dataListLoading.value = true
  sysMenuListApi().then((data) => {
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
    sysMenuDeleteApi({ id: id }).then(() => {
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

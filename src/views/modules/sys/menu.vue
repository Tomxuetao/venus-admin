<template>
  <div class="mod-menu">
    <el-form :inline="true">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" row-key="menuId" :expand-row-keys="[1]" border style="width: 100%;">
      <el-table-column prop="name" min-width="150" label="名称"></el-table-column>
      <el-table-column prop="parentName" align="center" width="120" label="上级菜单"></el-table-column>
      <el-table-column align="center" label="图标">
        <template v-slot="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" align="center" label="类型">
        <template v-slot="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" align="center" label="排序号"></el-table-column>
      <el-table-column prop="url" align="center" width="150" :show-overflow-tooltip="true"
                       label="菜单URL"></el-table-column>
      <el-table-column prop="perms" align="center" width="150" :show-overflow-tooltip="true"
                       label="授权标识"></el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button v-if="isAuth('sys:menu:update')" link size="small" @click="addOrUpdateHandle(scope.row.menuId)">
            修改
          </el-button>
          <el-button v-if="isAuth('sys:menu:delete')" link size="small" @click="deleteHandle(scope.row.menuId)"
                     style="color: #f56c6c;">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataListHandle"></add-or-update>
  </div>
</template>

<script setup>
import AddOrUpdate from './menu-add-or-update.vue'

import { treeDataTranslate, isAuth } from '@/utils'
import { useHttp } from '@/utils/http'

import { ref, nextTick } from 'vue'

import { ElMessageBox, ElMessage } from 'element-plus'

const http = useHttp()

let dataList = ref([])
let dataListLoading = ref(false)
let addOrUpdateVisible = ref(false)

const getDataListHandle = () => {
  dataListLoading.value = true
  http({
    url: http.adornUrl('/sys/menu/list'),
    method: 'get',
    params: http.adornParams()
  }).then(({ code, msg, data }) => {
    if (code === 200) {
      dataList.value = treeDataTranslate(data, 'menuId')
      dataListLoading.value = false
    } else {
      ElMessage.error(msg)
    }
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
    http({
      url: http.adornUrl(`/sys/menu/delete/${id}`),
      method: 'post',
      data: http.adornData()
    }).then(({ code, msg }) => {
      if (code === 200) {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            getDataListHandle()
          }
        })
      } else {
        ElMessage.error(msg)
      }
    })
  }).catch(() => {
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

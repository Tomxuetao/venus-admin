<template>
  <div class="mod-menu">
    <el-form :inline="true">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" row-key="menuId" border style="width: 100%; ">
      <el-table-column prop="name" header-align="center" min-width="150" label="名称"></el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" width="120" label="上级菜单"></el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template v-slot="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template v-slot="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="排序号"></el-table-column>
      <el-table-column prop="url" header-align="center" align="center" width="150" :show-overflow-tooltip="true"
                       label="菜单URL"></el-table-column>
      <el-table-column prop="perms" header-align="center" align="center" width="150" :show-overflow-tooltip="true"
                       label="授权标识"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataListHandle"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './menu-add-or-update.vue'

import { treeDataTranslate, isAuth } from '@/utils'
import { useHttp } from '@/utils/http'

import { ref, nextTick, getCurrentInstance } from 'vue'

export default {
  components: {
    AddOrUpdate
  },

  setup () {
    const http = useHttp()
    const { ctx } = getCurrentInstance()

    let dataList = ref([])
    let dataListLoading = ref(false)
    let addOrUpdateVisible = ref(false)

    const getDataListHandle = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/menu/list'),
        method: 'get',
        params: http.adornParams()
      }).then(({ code, msg, data}) => {
        if (code === 200) {
          dataList.value = treeDataTranslate(data, 'menuId')
          dataListLoading.value = false
        } else {
          ctx.$message.error(msg)
        }
      }).catch(() => {
        dataListLoading.value = false
      })
    }

    getDataListHandle()

    const deleteHandle = (id) => {
      ctx.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl(`/sys/menu/delete/${id}`),
          method: 'post',
          data: http.adornData()
        }).then(({ code, msg}) => {
          if (code === 200) {
            ctx.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataListHandle()
              }
            })
          } else {
            ctx.$message.error(msg)
          }
        })
      }).catch(() => {
      })
    }

    let addOrUpdateRef = ref(null)

    const addOrUpdateHandle = (id) => {
      addOrUpdateVisible.value = true
      nextTick(() => {
        addOrUpdateRef.value.initDialogHandle(id)
      })
    }

    return {
      dataList,
      addOrUpdateRef,
      dataListLoading,
      addOrUpdateVisible,

      isAuth,
      getDataListHandle,
      deleteHandle,
      addOrUpdateHandle
    }
  }
}
</script>

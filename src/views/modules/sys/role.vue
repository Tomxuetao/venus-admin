<template>
  <div class="mod-role">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
        <el-button
          v-if="isAuth('sys:role:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          v-if="isAuth('sys:role:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="roleId" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="roleName" align="center" label="角色名称"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column prop="createTime" align="center" width="180" label="创建时间"></el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button v-if="isAuth('sys:role:update')" link size="small" @click="addOrUpdateHandle(scope.row.roleId)">
            修改
          </el-button>
          <el-button v-if="isAuth('sys:role:delete')" link size="small" @click="deleteHandle(scope.row.roleId)"
                     style="color: #f56c6c;">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="pageSizeChangeHandle"
      @current-change="pageNumChangeHandle"
      :current-page="searchForm.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="searchForm.pageSize"
      :total="count"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataListHandle"></add-or-update>
  </div>
</template>

<script setup>
import { sysRolePageApi, deleteSysRoleApi } from '@/api/role-api'
import AddOrUpdate from './role-add-or-update.vue'
import { ref, reactive, nextTick } from 'vue'
import { isAuth } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'

const searchForm = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: null
})

let count = ref(0)
let dataList = ref([])
let dataListLoading = ref(false)
let dataListSelections = ref([])
let addOrUpdateVisible = ref(false)
let addOrUpdateRef = ref(null)


const getDataListHandle = () => {
  dataListLoading.value = true
  sysRolePageApi(searchForm).then(({ total, list }) => {
    count.value = total
    dataList.value = list
  }).finally(() => {
    dataListLoading.value = false
  })
}

getDataListHandle()

// 每页数
const pageSizeChangeHandle = (pageSize) => {
  dataForm.pageNum = 1
  dataForm.pageSize = pageSize
  getDataListHandle()
}

// 当前页
const pageNumChangeHandle = (pageNum) => {
  dataForm.pageNum = pageNum
  getDataListHandle()
}

const selectionChangeHandle = (value) => {
  dataListSelections.value = value
}

const addOrUpdateHandle = (id = undefined) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.initDialogHandle(id)
  })
}

const deleteHandle = (id = undefined) => {
  const ids = id ? [id] : dataListSelections.value.map(item => item.roleId)
  ElMessageBox.confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSysRoleApi({ ids }).then(() => {
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
</script>

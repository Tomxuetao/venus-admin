<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
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
      <el-table-column prop="userId" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="username" align="center" label="用户名"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" align="center" label="手机号"></el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" align="center" width="180" label="创建时间"></el-table-column>
      <el-table-column
          fixed="right"

          align="center"
          width="150"
          label="操作">
        <template v-slot="scope">
          <el-button v-if="isAuth('sys:user:update')" link size="small" @click="addOrUpdateHandle(scope.row.userId)">
            修改
          </el-button>
          <el-button v-if="isAuth('sys:user:delete')" link size="small" @click="deleteHandle(scope.row.userId)"
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
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataListHandle"></add-or-update>
  </div>
</template>

<script setup>
import AddOrUpdate from './user-add-or-update.vue'
import { useHttp } from '@/utils/http'
import { ref, reactive, nextTick } from 'vue'
import { isAuth } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'


const http = useHttp()

const addOrUpdateRef = ref(null)

const searchForm = reactive({
  userName: null,
  pageNum: 1,
  pageSize: 10
})

let total = ref(0)
const dataList = ref([])
const dataListLoading = ref(false)
const dataListSelections = ref([])
const addOrUpdateVisible = ref(false)

// 获取数据列表
let isSizeChange = false
const getDataListHandle = () => {
  dataListLoading.value = true
  http({
    url: http.adornUrl('/sys/user/list'),
    method: 'get',
    params: http.adornParams(searchForm)
  }).then(({ code, data }) => {
    isSizeChange = false
    if (code === 200) {
      dataList.value = data.list
      total.value = data.total
    } else {
      dataList.value = []
      total.value = 0
    }
    dataListLoading.value = false
  })
}

getDataListHandle()

// 多选
const selectionChangeHandle = (value) => {
  dataListSelections.value = value
}
// 新增 / 修改
const addOrUpdateHandle = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.initDialogHandle(id)
  })
}

// 删除
const deleteHandle = (id) => {
  const userIds = id ? [id] : dataListSelections.value.map(item => {
    return item.userId
  })
  ElMessageBox.confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/sys/user/delete'),
      method: 'post',
      data: http.adornData(userIds, false)
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
  })
}

// 每页数
const pageSizeChangeHandle = (pageSize) => {
  isSizeChange = true
  dataForm.pageNum = 1
  dataForm.pageSize = pageSize
  getDataListHandle()
}

// 当前页
const pageNumChangeHandle = (pageNum) => {
  if (!isSizeChange) {
    dataForm.pageNum = pageNum
    getDataListHandle()
  }
}
</script>

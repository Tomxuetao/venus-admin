<template>
  <div class="mod-oss">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="configHandle()">云存储配置</el-button>
        <el-button type="primary" @click="uploadHandle()">上传文件</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="id" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="url" align="center" label="URL地址"></el-table-column>
      <el-table-column prop="createDate" align="center" width="180" label="创建时间"></el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button link size="small" @click="deleteHandle(scope.row.id)" style="color: #f56c6c;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="pageSizeChangeHandle"
        @current-change="pageNumChangeHandle"
        :current-page="dataForm.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="dataForm.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 云存储配置 -->
    <config v-if="configVisible" ref="configRef"></config>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible" ref="uploadRef" @refreshDataList="getDataListHandle"></upload>
  </div>
</template>

<script setup>
import Config from './oss-config.vue'
import Upload from './oss-upload.vue'
import { reactive, ref, nextTick } from 'vue'
import { useHttp } from '@/utils/http'
import { ElMessageBox, ElMessage } from 'element-plus'

const http = useHttp()

let isSizeChange = false
let dataForm = reactive({
  pageSize: 10,
  pageNum: 1
})
let dataList = ref([])
let dataListLoading = ref(false)
let total = ref(0)

const getDataListHandle = () => {
  dataListLoading.value = true
  http({
    url: http.adornUrl('/sys/oss/list'),
    method: 'get',
    params: http.adornParams(dataForm)
  }).then(({ code, data }) => {
    isSizeChange = true
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

let configVisible = ref(false)
let configRef = ref(null)
const configHandle = () => {
  configVisible.value = true
  nextTick(() => {
    configRef.value.initDialogHandle()
  })
}

// 上传文件
let uploadVisible = ref(false)
let uploadRef = ref(null)
const uploadHandle = () => {
  uploadVisible.value = true
  nextTick(() => {
    uploadRef.value.initDialogHandle()
  })
}

// 删除
const deleteHandle = (id) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.id
  })
  ElMessageBox.confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/sys/oss/delete'),
      method: 'post',
      data: http.adornData(ids, false)
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

let dataListSelections = ref([])
const selectionChangeHandle = (value) => {
  dataListSelections.value = value
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

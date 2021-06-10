<template>
  <div class="mod-config">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.paramKey" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="id" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="paramKey" align="center" label="参数名"></el-table-column>
      <el-table-column prop="paramValue" align="center" label="参数值"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)" style="color: #f56c6c;">删除</el-button>
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

<script>
import AddOrUpdate from './config-add-or-update.vue'

import { useHttp } from '@/utils/http'
import { ref, reactive, nextTick, getCurrentInstance } from 'vue'

export default {
  components: {
    AddOrUpdate
  },

  setup() {
    const http = useHttp()
    const { ctx } = getCurrentInstance()

    const searchForm = reactive({
      paramKey: '',
      pageSize: 10,
      pageNum: 1
    })

    // 获取数据列表
    let dataListLoading = ref(false)
    let dataList = ref([])
    let total = ref(0)

    let isSizeChange = false
    const getDataListHandle = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/config/list'),
        method: 'get',
        params: http.adornParams(searchForm)
      }).then(({ code, data }) => {
        isSizeChange = false
        if (code === 200) {
          dataList.value = [...data.list]
          total.value = data.total
        } else {
          dataList.value = []
          total.value = 0
        }
        dataListLoading.value = false
      })
    }

    getDataListHandle()

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

    // 多选
    let dataListSelections = ref([])
    const selectionChangeHandle = (list) => {
      dataListSelections.value = list
    }

    // 新增 / 修改
    let addOrUpdateVisible = ref(false)
    let addOrUpdateRef = ref(null)
    const addOrUpdateHandle = (id) => {
      addOrUpdateVisible.value = true
      nextTick(() => {
        addOrUpdateRef.value.initDialogHandle(id)
      })
    }

    // 删除
    const deleteHandle = (id) => {
      const ids = id ? [id] : dataListSelections.value.map(item => {
        return item.id
      })
      ctx.$confirm(`确定对[id=${ ids.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/config/delete'),
          method: 'post',
          data: http.adornData(ids, false)
        }).then(({ code, msg }) => {
          if (code === 200) {
            ctx.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                getDataListHandle()
              }
            })
          } else {
            ctx.$message.error(msg)
          }
        })
      })
    }

    return {
      total,
      dataList,
      searchForm,
      addOrUpdateRef,
      dataListLoading,
      addOrUpdateVisible,
      dataListSelections,

      deleteHandle,
      getDataListHandle,
      addOrUpdateHandle,
      pageNumChangeHandle,
      pageSizeChangeHandle,
      selectionChangeHandle
    }
  }
}
</script>

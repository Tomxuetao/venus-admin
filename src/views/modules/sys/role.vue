<template>
  <div class="mod-role">
    <el-form :inline="true" :model="searchForm" >
      <el-form-item>
        <el-input v-model="searchForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()"
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
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template v-slot="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="searchForm.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="searchForm.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './role-add-or-update.vue'
import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { useHttp } from '@/utils/http'
import { isAuth } from '@/utils'

export default {
  components: {
    AddOrUpdate
  },

  setup() {
    const http = useHttp()
    const { ctx } = getCurrentInstance()

    const searchForm = reactive({
      pageNum: 1,
      pageSize: 10,
      roleName: null
    })

    let total = ref(0)
    let dataList = ref([])
    let dataListLoading = ref(false)
    let dataListSelections = ref([])
    let addOrUpdateVisible = ref(false)
    let addOrUpdateRef = ref(null)

    const getDataList = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/role/list'),
        method: 'get',
        params: http.adornParams(searchForm)
      }).then(({ code, page}) => {
        if (code === 200) {
          dataListLoading.value = false
          total.value = page.total
          dataList.value = page.list
        }
      })
    }

    getDataList()

    const sizeChangeHandle = (value) => {
      searchForm.page = 1
      searchForm.limit = value
      getDataList()
    }

    const currentChangeHandle = (value) => {
      searchForm.page = value
      getDataList()
    }

    const selectionChangeHandle = (value) => {
      dataListSelections.value = value
    }

    const addOrUpdateHandle = (id) => {
      addOrUpdateVisible.value = true
      nextTick(() => {
        addOrUpdateRef.value.init(id)
      })
    }

    const deleteHandle = (id) => {
      const ids = id ? [id] : dataListSelections.value.map(item => {
        return item.roleId
      })
      ctx.$confirm(`确定对[id=${ ids.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/role/delete'),
          method: 'post',
          data: http.adornData(ids, false)
        }).then(({code, msg }) => {
          if (code === 200) {
            ctx.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                getDataList()
              }
            })
          } else {
            ctx.$message.error(msg)
          }
        })
      }).catch(() => {
      })
    }


    return {
      total,
      dataList,
      searchForm,
      addOrUpdateRef,
      dataListLoading,
      dataListSelections,
      addOrUpdateVisible,

      isAuth,
      getDataList,
      deleteHandle,
      sizeChangeHandle,
      addOrUpdateHandle,
      currentChangeHandle,
      selectionChangeHandle
    }
  }
}
</script>

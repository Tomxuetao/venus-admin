<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
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
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
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
          <el-button v-if="isAuth('sys:user:update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.userId)">修改
          </el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="searchForm.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="searchForm.pageSize"
      :total="searchForm.totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import { useHttp } from '@/utils/http'
import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { isAuth } from '@/utils'

export default {
  components: {
    AddOrUpdate
  },

  setup () {
    const { ctx } = getCurrentInstance()
    const http = useHttp()

    const addOrUpdateRef = ref(null)

    const searchForm = reactive({
      userName: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    })

    const dataList = ref([])

    const dataListLoading = ref(false)

    const dataListSelections = ref([])
    const addOrUpdateVisible = ref(false)

    // 获取数据列表
    const getDataList = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/user/list'),
        method: 'get',
        params: http.adornParams({
          page: searchForm.pageIndex,
          limit: searchForm.pageSize,
          username: searchForm.userName
        })
      }).then(({
        code,
        page
      }) => {
        if (code === 0) {
          dataList.value = page.list
          searchForm.totalPage = page.totalCount
        } else {
          dataList.value = []
          searchForm.totalPage = 0
        }
        dataListLoading.value = false
      })
    }

    getDataList()

    // 每页数
    const sizeChangeHandle = (value) => {
      searchForm.pageSize = value
      searchForm.pageIndex = 1
      getDataList()
    }
    // 当前页
    const currentChangeHandle = (value) => {
      searchForm.pageIndex = value
      getDataList()
    }
    // 多选
    const selectionChangeHandle = (value) => {
      dataListSelections.value = value
    }
    // 新增 / 修改
    const addOrUpdateHandle = (id) => {
      addOrUpdateVisible.value = true
      nextTick(() => {
        addOrUpdateRef.value.init(id)
      })
    }

    // 删除
    const deleteHandle = (id) => {
      const userIds = id ? [id] : dataListSelections.value.map(item => {
        return item.userId
      })
      ctx.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/user/delete'),
          method: 'post',
          data: http.adornData(userIds, false)
        }).then(({ code, msg }) => {
          if (code === 0) {
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
      })
    }

    return {
      addOrUpdateRef,
      searchForm,
      dataList,
      dataListLoading,
      dataListSelections,
      addOrUpdateVisible,

      isAuth,
      getDataList,
      sizeChangeHandle,
      currentChangeHandle,
      selectionChangeHandle,
      addOrUpdateHandle,
      deleteHandle
    }
  }
}
</script>

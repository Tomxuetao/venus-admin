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
      :current-page="searchForm.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="searchForm.limit"
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
      page: 1,
      limit: 10,
      roleName: null
    })

    let total = ref(0)
    let dataList = ref([])
    let dataListLoading = ref(false)
    const dataListSelections = ref([])
    let addOrUpdateVisible = ref(false)
    const addOrUpdateRef = ref(null)

    const getDataList = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/role/list'),
        method: 'get',
        params: http.adornParams(searchForm)
      }).then(({ code, page}) => {
        if (code === 0) {
          dataListLoading.value = false
          total = page.totalPage
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

    const deleteHandle = () => {
      const ids = id ? [id] : dataListSelections.value.map(item => {
        return item.roleId
      })
      this.$confirm(`确定对[id=${ ids.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/role/delete'),
          method: 'post',
          data: http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            ctx.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                getDataList()
              }
            })
          } else {
            ctx.$message.error(data.msg)
          }
        })
      }).catch(() => {
      })
    }


    return {
      total,
      dataList,
      searchForm,
      dataListLoading,
      dataListSelections,
      addOrUpdateVisible,
      addOrUpdateRef,

      getDataList,
      deleteHandle,
      sizeChangeHandle,
      addOrUpdateHandle,
      currentChangeHandle,
      selectionChangeHandle,
      isAuth
    }
  },
  // data () {
  //   return {
  //     dataForm: {
  //       roleName: ''
  //     },
  //     dataList: [],
  //     pageIndex: 1,
  //     pageSize: 10,
  //     totalPage: 0,
  //     dataListLoading: false,
  //     dataListSelections: [],
  //     addOrUpdateVisible: false
  //   }
  // },
  // activated () {
  //   this.getDataList()
  // },
  // methods: {
  //   // 获取数据列表
  //   getDataList () {
  //     this.dataListLoading = true
  //     this.$http({
  //       url: this.$http.adornUrl('/sys/role/list'),
  //       method: 'get',
  //       params: this.$http.adornParams({
  //         page: this.pageIndex,
  //         limit: this.pageSize,
  //         roleName: this.dataForm.roleName
  //       })
  //     }).then(({ data }) => {
  //       if (data && data.code === 0) {
  //         this.dataList = data.page.list
  //         this.totalPage = data.page.totalCount
  //       } else {
  //         this.dataList = []
  //         this.totalPage = 0
  //       }
  //       this.dataListLoading = false
  //     })
  //   },
  //   // 每页数
  //   sizeChangeHandle (val) {
  //     this.pageSize = val
  //     this.pageIndex = 1
  //     this.getDataList()
  //   },
  //   // 当前页
  //   currentChangeHandle (val) {
  //     this.pageIndex = val
  //     this.getDataList()
  //   },
  //   // 多选
  //   selectionChangeHandle (val) {
  //     this.dataListSelections = val
  //   },
  //   // 新增 / 修改
  //   addOrUpdateHandle (id) {
  //     this.addOrUpdateVisible = true
  //     this.$nextTick(() => {
  //       this.$refs.addOrUpdate.init(id)
  //     })
  //   },
  //   // 删除
  //   deleteHandle (id) {
  //     var ids = id ? [id] : this.dataListSelections.map(item => {
  //       return item.roleId
  //     })
  //     this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     }).then(() => {
  //       this.$http({
  //         url: this.$http.adornUrl('/sys/role/delete'),
  //         method: 'post',
  //         data: this.$http.adornData(ids, false)
  //       }).then(({ data }) => {
  //         if (data && data.code === 0) {
  //           this.$message({
  //             message: '操作成功',
  //             type: 'success',
  //             duration: 1500,
  //             onClose: () => {
  //               this.getDataList()
  //             }
  //           })
  //         } else {
  //           this.$message.error(data.msg)
  //         }
  //       })
  //     }).catch(() => {
  //     })
  //   }
  // }
}
</script>

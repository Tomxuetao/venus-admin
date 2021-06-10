<template>
  <div class="mod-schedule">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.beanName" placeholder="bean名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
        <el-button v-if="isAuth('sys:schedule:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:schedule:delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
        <el-button v-if="isAuth('sys:schedule:pause')" type="danger" @click="pauseHandle()"
                   :disabled="dataListSelections.length <= 0">批量暂停
        </el-button>
        <el-button v-if="isAuth('sys:schedule:resume')" type="danger" @click="resumeHandle()"
                   :disabled="dataListSelections.length <= 0">批量恢复
        </el-button>
        <el-button v-if="isAuth('sys:schedule:run')" type="danger" @click="runHandle()"
                   :disabled="dataListSelections.length <= 0">批量立即执行
        </el-button>
        <el-button v-if="isAuth('sys:schedule:log')" type="success" @click="logHandle()">日志列表</el-button>
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

         align="center"
          width="50">
      </el-table-column>
      <el-table-column
          prop="jobId"

         align="center"
          width="80"
          label="ID">
      </el-table-column>
      <el-table-column
          prop="beanName"

         align="center"
          label="bean名称">
      </el-table-column>
      <el-table-column
          prop="params"

         align="center"
          label="参数">
      </el-table-column>
      <el-table-column
          prop="cronExpression"

         align="center"
          label="cron表达式">
      </el-table-column>
      <el-table-column
          prop="remark"

         align="center"
          label="备注">
      </el-table-column>
      <el-table-column
          prop="status"

         align="center"
          label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">暂停</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"

         align="center"
          width="240"
          label="操作">
        <template v-slot="scope">
          <el-button v-if="isAuth('sys:schedule:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.jobId)">修改</el-button>
          <el-button v-if="isAuth('sys:schedule:delete')" type="text" size="small" @click="deleteHandle(scope.row.jobId)" style="color: #f56c6c;">删除</el-button>
          <el-button v-if="isAuth('sys:schedule:pause')" type="text" size="small" @click="pauseHandle(scope.row.jobId)">暂停</el-button>
          <el-button v-if="isAuth('sys:schedule:resume')" type="text" size="small" @click="resumeHandle(scope.row.jobId)">恢复</el-button>
          <el-button v-if="isAuth('sys:schedule:run')" type="text" size="small" @click="runHandle(scope.row.jobId)">立即执行</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" @refreshDataList="getDataListHandle"></add-or-update>
    <!-- 弹窗, 日志列表 -->
    <schedule-log v-if="logVisible" ref="logRef"></schedule-log>
  </div>
</template>

<script>
import AddOrUpdate from './schedule-add-or-update.vue'
import ScheduleLog from './schedule-log.vue'

import { reactive, ref, nextTick, getCurrentInstance } from 'vue'
import { useHttp } from '@/utils/http'
import { isAuth } from '@/utils'

export default {
  components: {
    AddOrUpdate,
    ScheduleLog
  },
  setup () {
    const { ctx } = getCurrentInstance()

    const http = useHttp()

    const dataForm = reactive({
      beanName: null,
      pageSize: 10,
      pageNum: 1
    })

    const dataList = ref([])
    const total = ref(0)
    const dataListLoading = ref(false)
    const logVisible = ref(false)
    const addOrUpdateVisible = ref(false)
    const dataListSelections = ref([])

    // 获取数据列表
    let isSizeChange = false
    const getDataListHandle = () => {
      dataListLoading.value = true
      http({
        url: http.adornUrl('/sys/schedule/list'),
        method: 'get',
        params: http.adornParams(dataForm)
      }).then(({ code, msg, data }) => {
        isSizeChange = true
        if (code === 200) {
          dataList.value = data.list
          total.value = data.total
        } else {
          ctx.$message.error(msg)
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
    const selectionChangeHandle = (val) => {
      dataListSelections.value = val
    }

    // 新增 / 修改
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
        return item.jobId
      })
      ctx.confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/schedule/delete'),
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
      }).catch(() => {
      })
    }

    // 暂停
    const pauseHandle = (id) => {
      const ids = id ? [id] : dataListSelections.value.map(item => {
        return item.jobId
      })
      ctx.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/schedule/pause'),
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
      }).catch(() => {
      })
    }

    // 恢复
    const resumeHandle = (id) => {
      const ids = id ? [id] : dataListSelections.value.map(item => {
        return item.jobId
      })
      ctx.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/schedule/resume'),
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

    // 立即执行
    const runHandle = (id) => {
      const ids = id ? [id] : dataListSelections.value.map(item => {
        return item.jobId
      })
      ctx.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          url: http.adornUrl('/sys/schedule/run'),
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
      }).catch(() => {
      })
    }

    // 日志列表
    let logRef = ref(null)
    const logHandle = () => {
      logVisible.value = true
      nextTick(() => {
        logRef.value.initDialogHandle()
      })
    }

    return {
      total,
      logRef,
      dataList,
      dataForm,
      logVisible,
      addOrUpdateRef,
      dataListLoading,
      addOrUpdateVisible,
      dataListSelections,

      isAuth,
      logHandle,
      runHandle,
      pauseHandle,
      resumeHandle,
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

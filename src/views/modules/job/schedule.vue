<template>
  <div class="mod-schedule mod-wrap">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input
          v-model="dataForm.beanName"
          placeholder="bean名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListHandle()">查询</el-button>
        <el-button
          v-if="isAuth('sys:schedule:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          v-if="isAuth('sys:schedule:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >
          批量删除
        </el-button>
        <el-button
          v-if="isAuth('sys:schedule:pause')"
          type="danger"
          @click="pauseHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量暂停
        </el-button>
        <el-button
          v-if="isAuth('sys:schedule:resume')"
          type="danger"
          @click="resumeHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量恢复
        </el-button>
        <el-button
          v-if="isAuth('sys:schedule:run')"
          type="danger"
          @click="runHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量立即执行
        </el-button>
        <el-button v-if="isAuth('sys:schedule:log')" type="success" @click="$"
          >日志列表</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        empty-text="暂无数据"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="id"
          align="center"
          width="240"
          label="ID"
        ></el-table-column>
        <el-table-column
          prop="beanName"
          align="center"
          label="bean名称"
        ></el-table-column>
        <el-table-column
          prop="params"
          align="center"
          label="参数"
        ></el-table-column>
        <el-table-column
          prop="cronExpression"
          align="center"
          label="cron表达式"
        ></el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注"
        ></el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 1" size="small">正常</el-tag>
            <el-tag v-else size="small" type="danger">暂停</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="320" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="isAuth('sys:schedule:update')"
              link
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="isAuth('sys:schedule:delete')"
              link
              size="small"
              type="danger"
              @click="deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              v-if="isAuth('sys:schedule:pause')"
              link
              size="small"
              @click="pauseHandle(scope.row.id)"
            >
              暂停
            </el-button>
            <el-button
              v-if="isAuth('sys:schedule:resume')"
              link
              size="small"
              @click="resumeHandle(scope.row.id)"
            >
              恢复
            </el-button>
            <el-button
              v-if="isAuth('sys:schedule:run')"
              link
              size="small"
              @click="runHandle(scope.row.id)"
            >
              立即执行
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="pageSizeChangeHandle"
      @current-change="pageNumChangeHandle"
      :current-page="dataForm.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="dataForm.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="getDataListHandle"
    ></add-or-update>
  </div>
</template>

<script setup>
import {
 reactive, ref, nextTick 
} from 'vue'

import { isAuth } from '@/utils'
import { commonApi } from '@/api/common-api'

import AddOrUpdate from './schedule-add-or-update.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const dataForm = reactive({
  beanName: null,
  pageSize: 10,
  pageNum: 1
})

const dataList = ref([])
const total = ref(0)
const dataListLoading = ref(false)
const addOrUpdateVisible = ref(false)
const dataListSelections = ref([])

// 获取数据列表
const getDataListHandle = async () => {
  dataListLoading.value = true
  const data = await commonApi('/sys/schedule/page')
  dataListLoading.value = false
  dataList.value = data.list
  total.value = data.total
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

// 多选
const selectionChangeHandle = (val) => {
  dataListSelections.value = val
}

// 新增 / 修改
let addOrUpdateRef = ref()
const addOrUpdateHandle = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.initDialogHandle(id)
  })
}

// 删除
const deleteHandle = (id) => {
  const ids = id ? [id] : dataListSelections.value.map((item) => item.id)
  ElMessageBox.confirm(
    `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await commonApi('/sys/schedule/delete', ids, { method: 'post' })
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getDataListHandle()
      }
    })
  })
}

// 暂停
const pauseHandle = (id) => {
  const ids = id ? [id] : dataListSelections.value.map((item) => item.id)
  ElMessageBox.confirm(
    `确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await commonApi('/sys/schedule/pause', ids, { method: 'put' })
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getDataListHandle()
      }
    })
  })
}

// 恢复
const resumeHandle = (id) => {
  const ids = id ? [id] : dataListSelections.value.map((item) => item.id)
  ElMessageBox.confirm(
    `确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await commonApi('/sys/schedule/resume', ids, { method: 'put' })
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getDataListHandle()
      }
    })
  })
}

// 立即执行
const runHandle = (id) => {
  const ids = id ? [id] : dataListSelections.value.map((item) => item.id)
  ElMessageBox.confirm(
    `确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await commonApi('/sys/schedule/run', ids, { method: 'put' })
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getDataListHandle()
      }
    })
  })
}
</script>

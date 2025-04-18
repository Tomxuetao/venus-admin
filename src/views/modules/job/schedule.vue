<script setup>
import { commonApi } from '@/api/common-api'
import useView from '@/hooks/useView'

import AddOrUpdate from './schedule-add-or-update.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const commonView = reactive({
  ...useView({
    deleteIsBatch: true,
    deleteUrl: '/sys/schedule/delete',
    dataListUrl: '/sys/schedule/page',
    dataForm: {
      beanName: undefined
    }
  })
})

const statusMap = commonView.dictMap.get('job_status')

// 暂停
const pauseHandle = (id) => {
  const ids = id ? [id] : commonView.dataSelections.value.map((item) => item.id)
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
        commonView.getDataList()
      }
    })
  })
}

// 恢复
const resumeHandle = (id) => {
  const ids = id ? [id] : commonView.dataSelections.map((item) => item.id)
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
        commonView.getDataList()
      }
    })
  })
}

// 立即执行
const runHandle = (id) => {
  const ids = id ? [id] : commonView.dataSelections.map((item) => item.id)
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
        commonView.getDataList()
      }
    })
  })
}
</script>

<template>
  <div class="mod-schedule mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.beanName"
          placeholder="bean名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询</el-button
        >
        <el-button
          v-if="commonView.isAuth('sys:schedule:save')"
          type="primary"
          icon="Plus"
          @click="commonView.addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:schedule:delete')"
          type="danger"
          icon="Delete"
          @click="commonView.deleteHandle()"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:schedule:pause')"
          type="info"
          icon="VideoPause"
          @click="pauseHandle()"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量暂停
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:schedule:resume')"
          type="danger"
          icon="VideoPlay"
          @click="resumeHandle()"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量恢复
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:schedule:run')"
          type="success"
          icon="Aim"
          @click="runHandle()"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量立即执行
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:schedule:log')"
          type="primary"
          icon="List"
          @click="router.push({ name: 'sys-log-schedule' })"
        >
          日志列表
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        border
        empty-text="暂无数据"
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
        @selection-change="commonView.selectionChange"
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
            <el-tag
              size="small"
              :type="commonView.tagTypeMap.get(scope.row.status)"
            >
              {{ statusMap.get(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="320" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('sys:schedule:update')"
              link
              size="small"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:schedule:delete')"
              link
              size="small"
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:schedule:pause')"
              link
              size="small"
              @click="pauseHandle(scope.row.id)"
            >
              暂停
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:schedule:resume')"
              link
              size="small"
              @click="resumeHandle(scope.row.id)"
            >
              恢复
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:schedule:run')"
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
    <common-pager v-model="commonView"></common-pager>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList"
    >
    </add-or-update>
  </div>
</template>

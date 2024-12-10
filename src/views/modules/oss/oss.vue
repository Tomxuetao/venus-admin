<script setup>
import Config from './oss-config.vue'
import Upload from './oss-upload.vue'

import useView from '@/hooks/useView'

const commonView = reactive({
  ...useView({
    deleteUrl: '/sys/oss',
    dataListUrl: '/sys/oss/page',
    dataForm: {}
  })
})

let configVisible = ref(false)
let configRef = ref()
const configHandle = () => {
  configVisible.value = true
  nextTick(() => {
    configRef.value.initDialogHandle()
  })
}

// 上传文件
let uploadVisible = ref(false)
let uploadRef = ref()
const uploadHandle = () => {
  uploadVisible.value = true
  nextTick(() => {
    uploadRef.value.initDialogHandle()
  })
}
</script>

<template>
  <div class="mod-oss mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-button
          v-if="commonView.isAuth('oss:config:info')"
          type="primary"
          @click="configHandle()"
        >
          云存储配置
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:oss:upload')"
          type="primary"
          @click="uploadHandle()"
        >
          上传文件
        </el-button>
        <el-button
          type="danger"
          @click="commonView.deleteHandle(undefined)"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        border
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
        @selection-change="commonView.dataSelections"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="id"
          align="center"
          width="220"
          label="ID"
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          width="180"
          label="文件名"
        ></el-table-column>
        <el-table-column
          prop="url"
          align="center"
          label="URL地址"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="创建时间"
        ></el-table-column>
        <el-table-column fixed="right" align="center" width="150" label="操作">
          <template v-slot="scope">
            <el-button
              link
              size="small"
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination v-model="commonView"></common-pagination>
    <!-- 弹窗, 云存储配置 -->
    <config v-if="configVisible" ref="configRef"></config>
    <!-- 弹窗, 上传文件 -->
    <upload
      v-if="uploadVisible"
      ref="uploadRef"
      @refreshDataList="commonView.getDataList()"
    ></upload>
  </div>
</template>

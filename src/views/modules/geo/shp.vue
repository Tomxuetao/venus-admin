<script setup>
import useView from '@/hooks/useView'
import { venusServer } from '@/utils/http'

import Upload from './../oss/oss-upload.vue'

const commonView = reactive({
  ...useView({
    deleteUrl: '/sys/oss',
    dataListUrl: '/geo/data/page',
    dataForm: {}
  })
})

const router = useRouter()

// 上传文件
let uploadVisible = ref(false)
let uploadRef = ref()
const uploadHandle = () => {
  uploadVisible.value = true
  nextTick(() => {
    uploadRef.value.initDialogHandle('/geo/data/create')
  })
}
</script>

<template>
  <div class="mod-oss mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-button
          v-if="commonView.isAuth('geo:shp:create')"
          type="primary"
          icon="Upload"
          @click="uploadHandle()"
        >
          上传Shp
        </el-button>
        <el-button
          type="danger"
          icon="Delete"
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
          width="520"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="创建时间"
        ></el-table-column>
        <el-table-column fixed="right" align="center" label="操作">
          <template v-slot="scope">
            <el-button
              link
              size="small"
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              v-if="commonView.isAuth('geo:data:view')"
              @click="
                router.push({
                  name: 'geo-view',
                  params: { id: scope.row.id }
                })
              "
            >
              预览
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              v-if="commonView.isAuth('geo:data:export')"
              @click="commonView.exportHandle(scope.row.url)"
            >
              下载
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              v-if="commonView.isAuth('geo:export:shp')"
              @click="
                commonView.exportHandle(`${venusServer}/geo/data/toShp`, {
                  id: scope.row.id
                })
              "
            >
              导出Shp
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              v-if="commonView.isAuth('geo:export:json')"
              @click="
                commonView.exportHandle(`${venusServer}/geo/data/toGeoJson`, {
                  id: scope.row.id
                })
              "
            >
              导出GeoJson
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination v-model="commonView"></common-pagination>
    <!-- 弹窗, 上传文件 -->
    <upload
      v-if="uploadVisible"
      ref="uploadRef"
      @refreshDataList="commonView.getDataList()"
    ></upload>
  </div>
</template>

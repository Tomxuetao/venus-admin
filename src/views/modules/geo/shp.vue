<script setup>
import useView from '@/hooks/useView'
import { ElMessage } from 'element-plus'
import { venusServer } from '@/utils/http'

import UploadShp from '@/views/modules/geo/upload-shp.vue'

const router = useRouter()

const commonView = reactive({
  ...useView({
    deleteUrl: '/geo/data/delete',
    dataListUrl: '/geo/data/page',
    dataForm: {}
  })
})

const ossUrl = ref()
const uploadVisible = ref(false)
const uploadUrl = `${venusServer}/geo/data/create?token=${sessionStorage.getItem('token')}`

watch(
  () => ossUrl.value,
  () => {
    if (ossUrl.value) {
      commonView.getDataList()
      uploadVisible.value = false
      ElMessage.success('上传成功')
    }
  }
)
</script>

<template>
  <div class="mod-oss mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-button
          v-if="commonView.isAuth('geo:shp:create')"
          type="primary"
          icon="Upload"
          @click="uploadVisible = true"
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
              type="primary"
              v-if="commonView.isAuth('geo:data:view')"
              @click="
                router.push({
                  name: 'geo-shp-view',
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
            <el-button
              link
              size="small"
              type="danger"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pager v-model="commonView"></common-pager>
    <!-- 弹窗, 上传文件 -->
    <el-dialog
      v-if="uploadVisible"
      width="40%"
      title="上传文件"
      ref="uploadRef"
      v-model="uploadVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="() => (uploadVisible = false)"
    >
      <upload-shp v-model="ossUrl" :upload-url="uploadUrl"></upload-shp>
    </el-dialog>
  </div>
</template>

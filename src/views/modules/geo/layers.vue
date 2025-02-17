<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from './layer-add.vue'

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/geo/layer/delete',
    dataListUrl: '/geo/layer/page',
    dataForm: {}
  })
})

const router = useRouter()
const statusMap = commonView.dictMap.get('user_status')
</script>

<template>
  <div class="layers-mod mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          v-if="commonView.isAuth('geo:layer:save')"
          icon="Plus"
          type="primary"
          @click="commonView.addOrUpdateHandle(undefined)"
        >
          发布图层
        </el-button>
        <el-button
          v-if="commonView.isAuth('geo:layer:delete')"
          icon="Delete"
          type="danger"
          :disabled="commonView.dataSelections.length <= 0"
          @click="commonView.deleteHandle()"
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
        <el-table-column type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          width="180"
          label="图层名称"
        >
        </el-table-column>
        <el-table-column prop="title" align="center" label="图层标题">
        </el-table-column>
        <el-table-column prop="workspace" align="center" label="工作空间">
        </el-table-column>
        <el-table-column prop="datastore" align="center" label="存储仓库">
        </el-table-column>
        <el-table-column prop="type" align="center" label="图层类型">
        </el-table-column>
        <el-table-column prop="status" align="center" label="图层状态">
          <template v-slot="scope">
            <el-tag
              size="small"
              :type="commonView.tagTypeMap.get(scope.row.status)"
            >
              {{ statusMap.get(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="nativeSrs"
          align="center"
          width="180"
          label="Native SRC"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="160"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column fixed="right" align="center" width="240" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('geo:layer:view')"
              link
              size="small"
              type="primary"
              @click="
                router.push({
                  name: 'geo-layer-view',
                  params: { id: scope.row.id }
                })
              "
            >
              预览
            </el-button>
            <el-button
              v-if="commonView.isAuth('geo:layer:delete')"
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
    <add-or-update
      ref="addOrUpdateRef"
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      @refreshDataList="commonView.getDataList()"
    >
    </add-or-update>
  </div>
</template>

<style scoped lang="scss"></style>

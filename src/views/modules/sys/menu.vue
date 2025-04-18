<script setup>
import { buildTree } from '@/utils'
import useView from '@/hooks/useView'
import AddOrUpdate from './menu-add-or-update.vue'

const tagTypeMap = new Map([
  [0, 'primary'],
  [1, 'success']
])

const commonView = reactive({
  ...useView({
    isPage: false,
    deleteIsBatch: false,
    deleteUrl: '/sys/menu',
    dataListUrl: '/sys/menu/list',
    dataForm: {
      status: undefined,
      creatorName: undefined
    }
  })
})

const menuTypeMap = commonView.dictMap.get('menu_type')
</script>

<template>
  <div class="mod-menu mod-wrap">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          icon="Plus"
          type="primary"
          v-if="commonView.isAuth('sys:menu:save')"
          @click="commonView.addOrUpdateHandle(undefined)"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table :data="buildTree(commonView.dataList, '0')" row-key="id" border>
        <el-table-column prop="name" min-width="80" label="名称">
        </el-table-column>
        <el-table-column align="center" label="图标">
          <template v-slot="scope">
            <icon-svg :name="scope.row.icon || ''"></icon-svg>
          </template>
        </el-table-column>
        <el-table-column prop="type" align="center" label="类型">
          <template v-slot="scope">
            <el-tag size="small" :type="tagTypeMap.get(scope.row.type)">
              {{ menuTypeMap.get(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" align="center" label="排序号">
        </el-table-column>
        <el-table-column
          prop="url"
          align="center"
          width="200"
          label="菜单URL"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="permissions"
          align="center"
          width="200"
          label="授权标识"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column fixed="right" align="center" width="150" label="操作">
          <template v-slot="scope">
            <el-button
              link
              size="small"
              v-if="commonView.isAuth('sys:menu:update')"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              v-if="commonView.isAuth('sys:menu:save')"
              @click="commonView.addOrUpdateHandle(undefined, scope.row.id)"
            >
              新增
            </el-button>
            <el-button
              link
              size="small"
              type="danger"
              v-if="commonView.isAuth('sys:menu:delete')"
              @click="commonView.deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList()"
    >
    </add-or-update>
  </div>
</template>

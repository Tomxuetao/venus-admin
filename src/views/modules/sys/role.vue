<script setup>
import useView from '@/hooks/useView'
import AddOrUpdate from './role-add-or-update.vue'
import RoleDataUpdate from './role-data-update.vue'

const router = useRouter()

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteUrl: '/sys/role',
    dataListUrl: '/sys/role/page',
    dataForm: {
      name: undefined
    }
  })
})

const roleDataVisible = ref(false)
</script>

<template>
  <div class="mod-role mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.name"
          clearable
          placeholder="角色名称"
          @clear="commonView.getDataList()"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="commonView.getDataList()" icon="Search"
          >查询</el-button
        >
        <el-button
          v-if="commonView.isAuth('sys:role:save')"
          icon="Plus"
          type="primary"
          @click="commonView.addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          v-if="commonView.isAuth('sys:role:delete')"
          type="danger"
          icon="Delete"
          @click="commonView.deleteHandle()"
          :disabled="commonView.dataSelections.length <= 0"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        border
        style="width: 100%"
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
          width="200"
          label="ID"
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="创建时间"
        ></el-table-column>
        <el-table-column fixed="right" align="center" width="280" label="操作">
          <template v-slot="scope">
            <el-button
              v-if="commonView.isAuth('sys:role:update')"
              link
              size="small"
              @click="commonView.addOrUpdateHandle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:role:data')"
              link
              size="small"
              type="success"
            >
              数据权限
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:role:user')"
              link
              size="small"
              type="primary"
              @click="
                router.push({
                  name: 'sys-role-user',
                  params: { id: scope.row.id }
                })
              "
            >
              授权用户
            </el-button>
            <el-button
              v-if="commonView.isAuth('sys:role:delete')"
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
    <common-pagination v-model="commonView"></common-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="commonView.addOrUpdateVisible"
      v-model="commonView.addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="commonView.getDataList()"
    >
    </add-or-update>
    <role-data-update
      ref="roleDataRef"
      v-if="roleDataVisible"
      v-model="roleDataVisible"
    >
    </role-data-update>
  </div>
</template>

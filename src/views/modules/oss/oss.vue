<template>
  <div class="mod-oss">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button
          v-if="isAuth('oss:config:info')"
          type="primary"
          @click="configHandle()"
          >云存储配置</el-button
        >
        <el-button
          v-if="isAuth('sys:oss:upload')"
          type="primary"
          @click="uploadHandle()"
          >上传文件</el-button
        >
        <el-button
          type="danger"
          @click="deleteHandle(undefined)"
          :disabled="dataListSelections.length <= 0"
          >批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
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
            @click="deleteHandle(scope.row.id)"
            style="color: #f56c6c"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="pageSizeChangeHandle"
      @current-change="pageNumChangeHandle"
      :current-page="dataForm.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="dataForm.pageSize"
      :total="count"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 云存储配置 -->
    <config v-if="configVisible" ref="configRef"></config>
    <!-- 弹窗, 上传文件 -->
    <upload
      v-if="uploadVisible"
      ref="uploadRef"
      @refreshDataList="getDataListHandle"
    ></upload>
  </div>
</template>

<script setup>
import { isAuth } from '@/utils';
import Config from './oss-config.vue';
import Upload from './oss-upload.vue';
import { reactive, ref, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ossConfigListApi, deleteRecordApi } from '@/api/oss-api';

let dataForm = reactive({
  pageSize: 10,
  pageNum: 1,
});
let dataList = ref([]);
let dataListLoading = ref(false);
let count = ref(0);

const getDataListHandle = () => {
  dataListLoading.value = true;
  ossConfigListApi(dataForm)
    .then(({ list, total }) => {
      dataList.value = list;
      count.value = total;
    })
    .finally(() => {
      dataListLoading.value = false;
    });
};
getDataListHandle();

let configVisible = ref(false);
let configRef = ref();
const configHandle = () => {
  configVisible.value = true;
  nextTick(() => {
    configRef.value.initDialogHandle();
  });
};

// 上传文件
let uploadVisible = ref(false);
let uploadRef = ref();
const uploadHandle = () => {
  uploadVisible.value = true;
  nextTick(() => {
    uploadRef.value.initDialogHandle();
  });
};

// 删除
const deleteHandle = (id) => {
  const ids = id ? [id] : dataListSelections.value.map((item) => item.id);
  ElMessageBox.confirm(
    `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    deleteRecordApi({
      ids: ids,
    })
      .then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            getDataListHandle();
          },
        });
      })
      .catch(() => {
        ElMessage.error(new Error());
      });
  });
};

let dataListSelections = ref([]);
const selectionChangeHandle = (value) => {
  dataListSelections.value = value;
};

// 每页数
const pageSizeChangeHandle = (pageSize) => {
  dataForm.pageNum = 1;
  dataForm.pageSize = pageSize;
  getDataListHandle();
};

// 当前页
const pageNumChangeHandle = (pageNum) => {
  dataForm.pageNum = pageNum;
  getDataListHandle();
};
</script>

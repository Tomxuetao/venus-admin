<script setup>
import { reactive, ref, nextTick } from 'vue';
import { treeDataTranslate } from '@/utils';

import { ElMessage } from 'element-plus';
import { commonApi } from '@/api/common-api';

const emit = defineEmits(['refresh-data-list']);

let btnLoading = ref(false);
let visible = ref(false);
let menuList = ref([]);
let expandedKeys = ref([1]);
let dataForm = reactive({
  id: undefined,
  name: '',
  remark: '',
});

const dataFormRef = ref();
const menuListTreeRef = ref();

const tempKey = ref(-666666);

const initDialogHandle = (id) => {
  btnLoading.value = false;
  dataForm.id = id || undefined;
  commonApi('/sys/menu/list')
    .then((data) => {
      visible.value = true;
      console.log(data);
      menuList.value = treeDataTranslate(data);
      nextTick(() => {
        if (dataFormRef.value && menuListTreeRef.value) {
          dataFormRef.value.resetFields();
          menuListTreeRef.value.setCheckedKeys([]);
        }
      });
    })
    .then(() => {
      if (dataForm.id) {
        commonApi(`/sys/role/${dataForm.id}`).then((data) => {
          dataForm.name = data.name;
          dataForm.remark = data.remark;
          const idx = data.menuIdList.indexOf(tempKey);
          if (idx !== -1) {
            data.menuIdList.splice(idx, data.menuIdList.length - idx);
          }
          menuListTreeRef.value.setCheckedKeys(data.menuIdList);
        });
      }
    });
};

const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    btnLoading.value = true;
    if (valid) {
      await commonApi(
        `/sys/role/${!dataForm.id ? 'save' : 'update'}`,
        {
          ...dataForm,
          menuIdList: [
            ...menuListTreeRef.value.getCheckedKeys(),
            ...menuListTreeRef.value.getHalfCheckedKeys(),
          ],
        },
        { method: dataForm.id ? 'put' : 'post' },
      );
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false;
          emit('refresh-data-list');
        },
      });
    } else {
      btnLoading.value = false;
    }
  });
};

const closeDialogHandle = () => {
  visible.value = false;
  dataFormRef.value.resetFields();
};

defineExpose({
  initDialogHandle,
});
</script>

<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" v-model="visible">
    <el-form :model="dataForm" ref="dataFormRef" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="授权">
        <el-tree
          ref="menuListTreeRef"
          node-key="id"
          show-checkbox
          :data="menuList"
          :default-expanded-keys="expandedKeys"
          :props="{ label: 'name', children: 'children' }"
        ></el-tree>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="closeDialogHandle">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { venusServer } from '@/utils/http'
import { commonApi, geoServerApi } from '@/api/common-api'
import UploadShp from '@/views/modules/geo/upload-shp.vue'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

const validateName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入图层名称'))
  }
  if (layerNameList.value.includes(value)) {
    callback(new Error('图层名称已存在'))
  } else {
    callback()
  }
}

const validateStore = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入数据存储'))
  } else {
    if (dataStoreList.value.includes(value)) {
      callback(new Error('数据存储已存在'))
    } else {
      callback()
    }
  }
}

const dataRule = {
  name: [{ required: true, validator: validateName, trigger: 'blur' }],
  title: [{ required: true, message: '请输入图层标题', trigger: 'blur' }],
  ossUrl: [{ required: true, message: '请选取文件', trigger: 'change' }],
  datastore: [{ required: true, validator: validateStore, trigger: 'blur' }],
  workspace: [{ required: true, message: '请选择工作空间', trigger: 'change' }]
}

const dataForm = reactive({
  id: undefined,
  name: undefined,
  title: undefined,
  ossUrl: undefined,
  workspace: undefined,
  datastore: undefined
})

const dataFormRef = ref()

const workspaceList = ref([])
const dataStoreList = ref([])
const layerNameList = ref([])

const initDialogHandle = async (id) => {
  visible.value = true
  if (id) {
    commonApi(`/geo/layer/${id}`).then((data) => {
      Object.assign(dataForm, data)
    })
  }
}

const submitLoading = ref(false)
const uploadUrl = `${venusServer}/geo/layer/upload?token=${sessionStorage.getItem('token')}`

const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      await commonApi(
        `/geo/layer/${dataForm.id ? 'update' : 'save'}`,
        dataForm,
        {
          method: dataForm.id ? 'put' : 'post'
        }
      )
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          submitLoading.value = false
          emit('refresh-data-list')
        }
      })
    }
  })
}

const getWorkspaces = async () => {
  const {
    workspaces: { workspace }
  } = (await geoServerApi('/rest/workspaces.json')) || {}
  if (Array.isArray(workspace)) {
    workspaceList.value = workspace
  }
}

getWorkspaces()

const getDatastores = async (workspace) => {
  if (workspace) {
    const {
      dataStores: { dataStore: dataStoreArray }
    } =
      (await geoServerApi(`/rest/workspaces/${workspace}/datastores.json`)) ||
      {}
    if (Array.isArray(dataStoreArray)) {
      dataStoreList.value = dataStoreArray.map((item) => item.name)
    }
  }
}

const getGeoLayers = async () => {
  const {
    layers: { layer: layerArray }
  } = (await geoServerApi('/rest/layers.json')) || {}
  if (Array.isArray(layerArray)) {
    layerNameList.value = layerArray.map((item) => item.name.split(':')[1])
  }
}

getGeoLayers()

defineExpose({
  init: initDialogHandle
})
</script>

<template>
  <el-dialog
    v-model="visible"
    width="40%"
    title="发布图层"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataFormRef"
      label-width="100px"
    >
      <el-form-item label="工作空间" prop="workspace">
        <el-select
          v-model="dataForm.workspace"
          @change="(value) => getDatastores(value)"
        >
          <el-option
            v-for="role in workspaceList"
            :key="role.name"
            :value="role.name"
            :label="role.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据存储" prop="datastore">
        <el-input
          v-model="dataForm.datastore"
          :disabled="!dataForm.workspace"
          placeholder="数据存储"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="图层名称" prop="name">
        <el-input
          v-model="dataForm.name"
          :disabled="!dataForm.workspace"
          placeholder="图层名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="图层标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="图层标题"></el-input>
      </el-form-item>
      <el-form-item label="图层文件" prop="ossUrl">
        <upload-shp v-model="dataForm.ossUrl" v-model:upload-url="uploadUrl">
        </upload-shp>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="dataFormSubmit()"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

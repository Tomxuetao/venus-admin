<script setup>
import { ossConfigDetailApi, savaOssConfigApi } from '@/api/oss-api'

import { ElMessage } from 'element-plus'
import { isAuth } from '@/utils'

const emit = defineEmits(['refresh-data-list'])

let dataForm = reactive({
  type: 4,
  qiniuDomain: '',
  qiniuPrefix: '',
  qiniuAccessKey: '',
  qiniuSecretKey: '',
  qiniuBucketName: '',

  aliyunDomain: '',
  aliyunPrefix: '',
  aliyunEndPoint: '',
  aliyunAccessKeyId: '',
  aliyunAccessKeySecret: '',
  aliyunBucketName: '',

  qcloudDomain: '',
  qcloudPrefix: '',
  qcloudAppId: '',
  qcloudSecretId: '',
  qcloudSecretKey: '',
  qcloudBucketName: '',
  qcloudRegion: '',

  minioPrefix: '',
  minioEndPoint: '',
  minioAccessKey: '',
  minioSecretKey: '',
  minioBucketName: '',
})

const dataRule = {
  qiniuDomain: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qiniuAccessKey: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qiniuSecretKey: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qiniuBucketName: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  aliyunDomain: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  aliyunEndPoint: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  aliyunAccessKeyId: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  aliyunAccessKeySecret: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  aliyunBucketName: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qcloudDomain: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qcloudAppId: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qcloudSecretId: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qcloudSecretKey: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qcloudBucketName: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
  qcloudRegion: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: 'blur',
    },
  ],
}

let visible = ref(false)
const initDialogHandle = () => {
  visible.value = true

  ossConfigDetailApi().then((data) => {
    dataForm = Object.assign(
      dataForm,
      data.type
        ? data
        : {
            ...data,
            type: 4,
          },
    )
  })
}

const dataFormRef = ref()
const dataFormSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      savaOssConfigApi(dataForm).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refresh-data-list')
          },
        })
      })
    }
  })
}

defineExpose({
  initDialogHandle,
})
</script>

<template>
  <el-dialog title="云存储配置" v-model="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataFormRef"
      label-width="140px"
      :disabled="!isAuth('oss:config:update')"
    >
      <el-form-item label="存储类型">
        <el-radio-group v-model="dataForm.type">
          <el-radio :value="4">Minio</el-radio>
          <el-radio :value="1">七牛</el-radio>
          <el-radio :value="2">阿里云</el-radio>
          <el-radio :value="3">腾讯云</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.type === 1">
        <el-form-item label="域名" prop="qiniuDomain">
          <el-input
            v-model="dataForm.qiniuDomain"
            placeholder="七牛绑定的域名"
          ></el-input>
        </el-form-item>
        <el-form-item label="路径前缀" prop="qiniuPrefix">
          <el-input
            v-model="dataForm.qiniuPrefix"
            placeholder="不设置默认为空"
          ></el-input>
        </el-form-item>
        <el-form-item label="AccessKey" prop="qiniuAccessKey">
          <el-input
            v-model="dataForm.qiniuAccessKey"
            placeholder="七牛AccessKey"
          ></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="qiniuSecretKey">
          <el-input
            v-model="dataForm.qiniuSecretKey"
            placeholder="七牛SecretKey"
          ></el-input>
        </el-form-item>
        <el-form-item label="空间名" prop="qiniuBucketName">
          <el-input
            v-model="dataForm.qiniuBucketName"
            placeholder="七牛存储空间名"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else-if="dataForm.type === 2">
        <el-form-item label="域名" prop="aliyunDomain">
          <el-input
            v-model="dataForm.aliyunDomain"
            placeholder="阿里云绑定的域名"
          ></el-input>
        </el-form-item>
        <el-form-item label="路径前缀" prop="aliyunPrefix">
          <el-input
            v-model="dataForm.aliyunPrefix"
            placeholder="不设置默认为空"
          ></el-input>
        </el-form-item>
        <el-form-item label="EndPoint" prop="aliyunEndPoint">
          <el-input
            v-model="dataForm.aliyunEndPoint"
            placeholder="阿里云EndPoint"
          ></el-input>
        </el-form-item>
        <el-form-item label="AccessKeyId" prop="aliyunAccessKeyId">
          <el-input
            v-model="dataForm.aliyunAccessKeyId"
            placeholder="阿里云AccessKeyId"
          ></el-input>
        </el-form-item>
        <el-form-item label="AccessKeySecret" prop="aliyunAccessKeySecret">
          <el-input
            v-model="dataForm.aliyunAccessKeySecret"
            placeholder="阿里云AccessKeySecret"
          ></el-input>
        </el-form-item>
        <el-form-item label="BucketName" prop="aliyunBucketName">
          <el-input
            v-model="dataForm.aliyunBucketName"
            placeholder="阿里云BucketName"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else-if="dataForm.type === 3">
        <el-form-item label="域名" prop="qcloudDomain">
          <el-input
            v-model="dataForm.qcloudDomain"
            placeholder="腾讯云绑定的域名"
          ></el-input>
        </el-form-item>
        <el-form-item label="路径前缀" prop="qcloudPrefix">
          <el-input
            v-model="dataForm.qcloudPrefix"
            placeholder="不设置默认为空"
          ></el-input>
        </el-form-item>
        <el-form-item label="AppId" prop="qcloudAppId">
          <el-input
            v-model="dataForm.qcloudAppId"
            placeholder="腾讯云AppId"
          ></el-input>
        </el-form-item>
        <el-form-item label="SecretId" prop="qcloudSecretId">
          <el-input
            v-model="dataForm.qcloudSecretId"
            placeholder="腾讯云SecretId"
          ></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="qcloudSecretKey">
          <el-input
            v-model="dataForm.qcloudSecretKey"
            placeholder="腾讯云SecretKey"
          ></el-input>
        </el-form-item>
        <el-form-item label="BucketName" prop="qcloudBucketName">
          <el-input
            v-model="dataForm.qcloudBucketName"
            placeholder="腾讯云BucketName"
          ></el-input>
        </el-form-item>
        <el-form-item label="Bucket所属地区" prop="qcloudRegion">
          <el-input
            v-model="dataForm.qcloudRegion"
            placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else-if="dataForm.type === 4">
        <el-form-item label="EndPoint" prop="minioEndPoint">
          <el-input
            v-model="dataForm.minioEndPoint"
            placeholder="EndPoint"
          ></el-input>
        </el-form-item>
        <el-form-item label="AccessKey" prop="minioAccessKey">
          <el-input
            v-model="dataForm.minioAccessKey"
            placeholder="AccessKey"
          ></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="minioSecretKey">
          <el-input
            v-model="dataForm.minioSecretKey"
            placeholder="SecretKey"
          ></el-input>
        </el-form-item>
        <el-form-item label="BucketName" prop="minioBucketName">
          <el-input
            v-model="dataForm.minioBucketName"
            placeholder="BucketName"
          ></el-input>
        </el-form-item>
        <el-form-item label="路径前缀" prop="minioPrefix">
          <el-input
            v-model="dataForm.minioPrefix"
            placeholder="不设置默认为空"
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          v-if="isAuth('oss:config:update')"
          type="primary"
          @click="dataFormSubmit()"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

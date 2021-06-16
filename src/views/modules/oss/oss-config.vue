<template>
  <el-dialog title="云存储配置" v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="140px">
      <el-form-item size="mini" label="存储类型">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">七牛</el-radio>
          <el-radio :label="2">阿里云</el-radio>
          <el-radio :label="3">腾讯云</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.type === 1">
        <el-form-item label="域名" prop="qiniuDomain">
          <el-input v-model="dataForm.qiniuDomain" placeholder="七牛绑定的域名"></el-input>
        </el-form-item>
        <el-form-item label="路径前缀" prop="qiniuPrefix">
          <el-input v-model="dataForm.qiniuPrefix" placeholder="不设置默认为空"></el-input>
        </el-form-item>
        <el-form-item label="AccessKey" prop="qiniuAccessKey">
          <el-input v-model="dataForm.qiniuAccessKey" placeholder="七牛AccessKey"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="qiniuSecretKey">
          <el-input v-model="dataForm.qiniuSecretKey" placeholder="七牛SecretKey"></el-input>
        </el-form-item>
        <el-form-item label="空间名" prop="qiniuBucketName">
          <el-input v-model="dataForm.qiniuBucketName" placeholder="七牛存储空间名"></el-input>
        </el-form-item>
      </template>
      <template v-else-if="dataForm.type === 2">
        <el-form-item label="域名" prop="aliyunDomain">
          <el-input v-model="dataForm.aliyunDomain" placeholder="阿里云绑定的域名"></el-input>
        </el-form-item>
        <el-form-item label="路径前缀" prop="aliyunPrefix">
          <el-input v-model="dataForm.aliyunPrefix" placeholder="不设置默认为空"></el-input>
        </el-form-item>
        <el-form-item label="EndPoint" prop="aliyunEndPoint">
          <el-input v-model="dataForm.aliyunEndPoint" placeholder="阿里云EndPoint"></el-input>
        </el-form-item>
        <el-form-item label="AccessKeyId" prop="aliyunAccessKeyId">
          <el-input v-model="dataForm.aliyunAccessKeyId" placeholder="阿里云AccessKeyId"></el-input>
        </el-form-item>
        <el-form-item label="AccessKeySecret" prop="aliyunAccessKeySecret">
          <el-input v-model="dataForm.aliyunAccessKeySecret" placeholder="阿里云AccessKeySecret"></el-input>
        </el-form-item>
        <el-form-item label="BucketName" prop="aliyunBucketName">
          <el-input v-model="dataForm.aliyunBucketName" placeholder="阿里云BucketName"></el-input>
        </el-form-item>
      </template>
      <template v-else-if="dataForm.type === 3">
        <el-form-item label="域名" prop="qcloudDomain">
          <el-input v-model="dataForm.qcloudDomain" placeholder="腾讯云绑定的域名"></el-input>
        </el-form-item>
        <el-form-item label="路径前缀" prop="qcloudPrefix">
          <el-input v-model="dataForm.qcloudPrefix" placeholder="不设置默认为空"></el-input>
        </el-form-item>
        <el-form-item label="AppId" prop="qcloudAppId">
          <el-input v-model="dataForm.qcloudAppId" placeholder="腾讯云AppId"></el-input>
        </el-form-item>
        <el-form-item label="SecretId" prop="qcloudSecretId">
          <el-input v-model="dataForm.qcloudSecretId" placeholder="腾讯云SecretId"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="qcloudSecretKey">
          <el-input v-model="dataForm.qcloudSecretKey" placeholder="腾讯云SecretKey"></el-input>
        </el-form-item>
        <el-form-item label="BucketName" prop="qcloudBucketName">
          <el-input v-model="dataForm.qcloudBucketName" placeholder="腾讯云BucketName"></el-input>
        </el-form-item>
        <el-form-item label="Bucket所属地区" prop="qcloudRegion">
          <el-input v-model="dataForm.qcloudRegion" placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import { useHttp } from '@/utils/http'

export default defineComponent({
  emits: ['refresh-data-list'],

  setup(props, { emit }) {
    const http = useHttp()

    const { ctx } = getCurrentInstance()

    let dataForm = reactive({
      type: 1,
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
      qcloudRegion: ''
    })

    let visible = ref(false)
    const initDialogHandle = (id) => {
      visible.value = true
      http({
        url: http.adornUrl('/sys/oss/config'),
        method: 'get',
        params: http.adornParams()
      }).then(({ data, code, msg }) => {
        if (code === 200) {
          dataForm = Object.assign(dataForm, data)
        } else {
          ctx.$message.error(msg)
        }
      })
    }

    const dataFormRef = ref(null)
    const dataFormSubmit = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          http({
            url: http.adornUrl('/sys/oss/saveConfig'),
            method: 'post',
            data: http.adornData(dataForm)
          }).then(({ code, msg}) => {
            if (code === 200) {
              ctx.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  visible.value = false
                  emit('refresh-data-list')
                }
              })
            } else {
              ctx.$message.error(msg)
            }
          })
        }
      })
    }

    return {
      visible,
      dataForm,
      dataFormRef,

      dataFormSubmit,
      initDialogHandle
    }
  }
})
</script>

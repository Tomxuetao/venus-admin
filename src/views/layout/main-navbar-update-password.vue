<template>
  <el-dialog title="修改密码" v-model="visible" :append-to-body="false" width="30%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px">
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { updatePswApi } from '@/api/user-api'
import { clearLoginInfo } from '@/utils'
import { ref, reactive, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'


const store = useStore()
const router = useRouter()

const visible = ref(false)

const dataFormRef = ref(null)

const dataForm = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (dataForm.newPassword !== value) {
    callback(new Error('确认密码与新密码不一致'))
  } else {
    callback()
  }
}

const dataRule = reactive({
  password: [
    { required: true, message: '原密码不能为空', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

const userName = computed(() => {
  return store.state.user.name
})

const mainTabs = computed({
  get: () => {
    return store.state.common.mainTabs
  },
  set: value => {
    store.commit('common/updateMainTabs', value)
  }
})

const initDialogHandle = () => {
  visible.value = true
  nextTick(() => {
    dataFormRef.value.resetFields()
  })
}

const dataFormSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      updatePswApi(dataForm).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            nextTick(() => {
              mainTabs.value = []
              clearLoginInfo()
              router.replace({ name: 'login' })
            })
          }
        })
      })
    }
  })
}

defineExpose({
  initDialogHandle
})
</script>

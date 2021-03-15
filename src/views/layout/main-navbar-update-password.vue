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

<script>
import { clearLoginInfo } from '@/utils'
import { ref, reactive, computed, nextTick, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useHttp } from '@/utils/http'
import { useRouter } from 'vue-router'
export default {
  setup () {
    const store = useStore()
    const http = useHttp()
    const router = useRouter()
    const { ctx } = getCurrentInstance()

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

    const userName = computed(() => { return store.state.user.name })

    const mainTabs = computed({
      get: () => { return store.state.common.mainTabs },
      set: value => { store.commit('common/updateMainTabs', value) }
    })

    const init = () => {
      visible.value = true
      nextTick(() => {
        dataFormRef.value.resetFields()
      })
    }

    const dataFormSubmit = () => {
      dataFormRef.value.validate((valid) => {
        console.log(valid)
        if (valid) {
          http({
            url: http.adornUrl('/sys/user/password'),
            method: 'post',
            data: http.adornData({
              password: dataForm.password,
              newPassword: dataForm.newPassword
            })
          }).then(({ code, msg }) => {
            if (code === 0) {
              ctx.$message({
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
            } else {
              ctx.$message({
                type: 'error',
                message: msg
              })
            }
          })
        }
      })
    }

    return {
      visible,
      dataFormRef,
      dataForm,
      dataRule,
      userName,

      init,
      dataFormSubmit
    }
  }
}
</script>

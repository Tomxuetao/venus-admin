<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.confirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
import { ref, reactive, getCurrentInstance } from 'vue'
import { useHttp } from '@/utils/http'

export default {
  emits: ['refresh-data-list'],
  setup (props, { emit }) {
    const http = useHttp()

    const { ctx } = getCurrentInstance()

    const validatePassword = (rule, value, callback) => {
      if (!dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }

    const visible = ref(false)

    let roleList = ref([])

    let dataForm = reactive({
      id: undefined,
      username: '',
      password: '',
      confirmPassword: '',
      salt: '',
      email: '',
      mobile: '',
      roleIdList: [],
      status: 1
    })

    const dataFormRef = ref(null)

    const dataRule = reactive({
      userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
      email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }, { validator: validateEmail, trigger: 'blur' }],
      mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { validator: validateMobile, trigger: 'blur' }]
    })

    const init = (id) => {
      dataForm.id = id || 0
      http({
        url: http.adornUrl('/sys/role/select'),
        method: 'get',
        params: http.adornParams()
      }).then(({ code, data }) => {
        roleList.value = code === 200 ? data : []
      }).then(() => {
        visible.value = true
      }).then(() => {
        if (dataForm.id) {
          http({
            url: http.adornUrl(`/sys/user/info/${dataForm.id}`),
            method: 'get',
            params: http.adornParams()
          }).then(({ code, data }) => {
            if (code === 200) {
              dataForm = Object.assign(dataForm, data)
            }
          })
        }
      })
    }

    // 表单提交
    const dataFormSubmit = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          http({
            url: http.adornUrl(`/sys/user/${!dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: http.adornData(dataForm)
          }).then(({ code, msg }) => {
            if (code === 200) {
              visible.value = false
              ctx.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
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
      roleList,
      dataForm,
      dataRule,
      dataFormRef,

      init,
      dataFormSubmit
    }
  }
}
</script>

<script setup>
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'
import { isEmail, isMobile } from '@/utils/validate'

const emit = defineEmits(['refresh-data-list'])

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
  status: 1,
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  email: '',
  mobile: '',
  gender: 0,
  roleIdList: [],
})

const dataFormRef = ref()

const dataRule = {
  username: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
  realName: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: validatePassword,
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      validator: validateConfirmPassword,
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: 'blur',
    },
    {
      validator: validateEmail,
      trigger: 'blur',
    },
  ],
  mobile: [
    {
      required: true,
      message: '手机号不能为空',
      trigger: 'blur',
    },
    {
      validator: validateMobile,
      trigger: 'blur',
    },
  ],
}

const initDialogHandle = async (id) => {
  dataForm.id = id
  visible.value = true

  roleList.value = await commonApi('/sys/role/list')

  //  sysUserDetailApi({ id: id }).then((data) => {
  //    roleList.value = data.roleIdList
  //  }).then(() => {
  //    visible.value = true
  //  })
  //  roleList.value = await commonApi('/sys/role/select')
  //  visible.value = true

  //  const tempData = commonApi(`/sys/user/info/${dataForm.id}`)

  //  dataForm = Object.assign(dataForm, tempData)
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi(
        `/sys/user/${!dataForm.id ? 'save' : 'update'}`,
        dataForm,
        { method: 'post' },
      )
      visible.value = false
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          emit('refresh-data-list')
        },
      })
    }
  })
}

defineExpose({
  init: initDialogHandle,
})
</script>

<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    v-model="visible"
    :destroy-on-close="true"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataFormRef"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="confirmPassword"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.confirmPassword"
          type="password"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="dataForm.gender">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
          <el-radio :label="2">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.id" :value="role.id">
            {{ role.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :value="0">禁用</el-radio>
          <el-radio :value="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

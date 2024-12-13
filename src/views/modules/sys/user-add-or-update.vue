<script setup>
import { useCommonStore } from '@/store'
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'
import { isEmail, isMobile } from '@/utils/validate'

const visible = defineModel()
const emit = defineEmits(['refresh-data-list'])

const { dictMap } = useCommonStore()
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

let roleList = ref([])

let dataForm = reactive({
  id: undefined,
  status: 1,
  username: '',
  password: '',
  realName: '',
  email: '',
  mobile: '',
  gender: 0,
  deptId: '',
  roleIdList: [],
  confirmPassword: ''
})

const dataFormRef = ref()

const dataRule = {
  username: [
    {
      required: true,
      trigger: 'blur',
      message: '账号名不能为空'
    }
  ],
  realName: [
    {
      required: true,
      trigger: 'blur',
      message: '真实姓名不能为空'
    }
  ],
  password: [
    {
      validator: validatePassword,
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      validator: validateConfirmPassword,
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: 'blur'
    },
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  mobile: [
    {
      required: true,
      message: '手机号不能为空',
      trigger: 'blur'
    },
    {
      validator: validateMobile,
      trigger: 'blur'
    }
  ],
  deptId: [
    {
      required: true,
      message: '所属部门不能为空',
      trigger: 'blur'
    }
  ],
  roleIdList: [
    {
      type: 'array',
      required: true,
      message: '角色不能为空',
      trigger: 'blur'
    }
  ]
}

const deptList = ref([])

const initDialogHandle = async (id) => {
  dataForm.id = id
  visible.value = true

  const tempDeptList = await commonApi('/sys/dept/list')
  if (Array.isArray(tempDeptList)) {
    deptList.value = tempDeptList
  }
  const tempRoleList = await commonApi('/sys/role/list')
  if (Array.isArray(tempRoleList)) {
    roleList.value = tempRoleList
  }

  if (id) {
    commonApi(`/sys/user/${id}`).then((data) => {
      Object.assign(dataForm, data)
    })
  }
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi(
        `/sys/user/${!dataForm.id ? 'save' : 'update'}`,
        dataForm,
        { method: dataForm.id ? 'put' : 'post' }
      )
      visible.value = false
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          emit('refresh-data-list')
        }
      })
    }
  })
}

defineExpose({
  init: initDialogHandle
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
      <template v-if="!dataForm.id">
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
          >
          </el-input>
        </el-form-item>
      </template>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="dataForm.gender">
          <el-radio
            v-for="([key, value], index) in dictMap.get('gender')"
            :value="key"
            :label="value"
            :key="index"
          >
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="deptId" label="所属部门">
        <el-tree-select
          v-model="dataForm.deptId"
          :data="deptList"
          node-key="id"
          check-strictly
          check-on-click-node
          :render-after-expand="false"
          :props="{ label: 'name', children: 'children' }"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item label="角色" prop="roleIdList">
        <el-select v-model="dataForm.roleIdList" multiple>
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :value="role.id"
            :label="role.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio
            v-for="([key, value], index) in dictMap.get('user_status')"
            :value="key"
            :label="value"
            :key="index"
          >
          </el-radio>
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

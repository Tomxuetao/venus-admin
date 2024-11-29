<script setup>
import { treeDataTranslate } from '@/utils'
import Icon from '@/assets/icons/index'
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common-api'
import { useCommonStore } from '@/store'

const emit = defineEmits(['refresh-data-list'])

const { menuList } = useCommonStore()

const menuTypeMap = new Map([
  [0, '菜单'],
  [1, '按钮']
])

let dataForm = reactive({
  id: undefined,
  type: 0,
  name: '',
  pid: 0,
  parentName: '顶级菜单',
  url: '',
  sort: 0,
  icon: '',
  permissions: ''
})

const validateUrl = (rule, value, callback) => {
  if (dataForm.type === 1 && !/\S/.test(value)) {
    callback(new Error('菜单URL不能为空'))
  } else {
    callback()
  }
}

const dataRule = {
  name: [
    {
      required: true,
      message: '名称不能为空',
      trigger: 'blur'
    }
  ],
  pid: [
    {
      required: true,
      message: '上级菜单不能为空',
      trigger: 'blur'
    }
  ],
  url: [
    {
      validator: validateUrl,
      trigger: 'blur'
    }
  ]
}

const iconList = Icon.getNameList()
let menuListTree = treeDataTranslate([
  ...menuList.filter((item) => item.type === 0)
])

let visible = ref(false)

let dataFormRef = ref()

const initDialogHandle = (id) => {
  dataForm.id = id
  if (id) {
    commonApi(`/sys/menu/${id}`).then((data) => {
      Object.assign(dataForm, data)
    })
  }
  visible.value = true
}

// 图标选中
const iconActiveHandle = (iconName) => {
  dataForm.icon = iconName
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await commonApi('/sys/menu', dataForm, {
        method: dataForm.id ? 'put' : 'post'
      })
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refresh-data-list')
        }
      })
    }
  })
}

defineExpose({
  initDialogHandle
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :destroy-on-close="true"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataFormRef"
      label-width="80px"
    >
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio
            v-for="(key, index) in menuTypeMap.keys()"
            :value="index"
            :key="index"
          >
            {{ menuTypeMap.get(key) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="pid">
        <el-tree-select
          v-model="dataForm.pid"
          :data="menuListTree"
          node-key="id"
          check-strictly
          check-on-click-node
          :render-after-expand="false"
          :props="{ label: 'name', children: 'children' }"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0" label="路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="路由"></el-input>
      </el-form-item>
      <el-form-item label="授权标识" prop="perms">
        <el-input
          v-model="dataForm.permissions"
          placeholder="多个用逗号分隔, 如: user:list,user:create"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number
          v-model="dataForm.sort"
          controls-position="right"
          :min="0"
          label="排序号"
        ></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 1" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              placement="bottom-start"
              trigger="click"
              popper-class="icon-popover"
            >
              <div class="icon-inner">
                <div
                  class="inner-item"
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === dataForm.icon }"
                >
                  <icon-svg :name="item"></icon-svg>
                </div>
              </div>
              <template #reference>
                <el-input
                  v-model="dataForm.icon"
                  placeholder="菜单图标名称"
                  class="icon-list__input"
                ></el-input>
              </template>
            </el-popover>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <template #content>
                <div>
                  全站推荐使用SVG Sprite, 详细请参考:<a target="_blank"></a>描述
                </div>
              </template>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss">
.icon-popover {
  width: max-content !important;
  overflow: hidden;
  cursor: pointer;

  .icon-inner {
    display: grid;
    grid-gap: 24px;
    overflow-y: auto;
    max-height: 258px;
    overflow-x: hidden;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(10, 32px);

    .inner-item {
      height: 32px;
      display: grid;
      align-items: center;
      justify-content: center;
    }
  }

  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>

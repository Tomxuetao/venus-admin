<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
            placement="bottom-start"
            trigger="click">
          <el-tree
              :data="menuListTree"
              :props="menuListTreeProps"
              node-key="menuId"
              ref="menuListTreeRef"
              @current-change="menuListTreeCurrentChangeHandle"
              :default-expand-all="true"
              :highlight-current="true"
              :expand-on-click-node="false">
          </el-tree>
          <template #reference>
            <el-input v-model="dataForm.parentName" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
        <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                      v-for="(item, index) in iconList"
                      :key="index"
                      @click="iconActiveHandle(item)"
                      :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </div>
              <template #reference>
                <el-input v-model="dataForm.icon" placeholder="菜单图标名称" class="icon-list__input"></el-input>
              </template>
            </el-popover>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <template #content>
                <div>全站推荐使用SVG Sprite, 详细请参考:<a target="_blank"></a>描述</div>
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

<script>
import { treeDataTranslate } from '@/utils'
import Icon from '@/icons'
import { useHttp } from '@/utils/http'
import { getCurrentInstance, ref, reactive, nextTick } from 'vue'

export default {
  emits: ['refresh-data-list'],

  setup() {
    const http = useHttp()
    const { ctx } = getCurrentInstance()

    let dataForm = reactive({
      id: 0,
      type: 1,
      typeList: ['目录', '菜单', '按钮'],
      name: '',
      parentId: 0,
      parentName: '',
      url: '',
      perms: '',
      orderNum: 0,
      icon: '',
      iconList: []
    })

    const validateUrl = (rule, value, callback) => {
      if (dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }

    let dataRule = reactive({
      name: [
        {
          required: true,
          message: '菜单名称不能为空',
          trigger: 'blur'
        }
      ],
      parentName: [
        {
          required: true,
          message: '上级菜单不能为空',
          trigger: 'change'
        }
      ],
      url: [
        {
          validator: validateUrl,
          trigger: 'blur'
        }
      ]
    })

    const iconList = Icon.getNameList()

    let menuListTree = ref([])

    let menuListTreeProps = reactive({
      label: 'name',
      children: 'children'
    })

    let visible = ref(false)

    let dataFormRef = ref(null)

    const init = (id) => {
      dataForm.id = id || 0
      http({
        url: http.adornUrl('/sys/menu/select'),
        method: 'get',
        params: http.adornParams()
      }).then(({ menuList }) => {
        menuListTree.value = treeDataTranslate(menuList, 'menuId')
      }).then(() => {
        visible.value = true
        nextTick(() => {
          if (dataFormRef.value) {
            dataFormRef.value.resetFields()
          }
        })
      }).then(() => {
        if (!dataForm.id) {
          // 新增
          menuListTreeSetCurrentNode()
        } else {
          // 修改
          http({
            url: http.adornUrl(`/sys/menu/info/${ dataForm.id }`),
            method: 'get',
            params: http.adornParams()
          }).then(({ menu }) => {
            dataForm.id = menu.menuId
            dataForm.type = menu.type
            dataForm.name = menu.name
            dataForm.parentId = menu.parentId
            dataForm.url = menu.url
            dataForm.perms = menu.perms
            dataForm.orderNum = menu.orderNum
            dataForm.icon = menu.icon
            menuListTreeSetCurrentNode()
          })
        }
      })
    }

    // 菜单树选中
    const menuListTreeCurrentChangeHandle = (data, node) => {
      dataForm.parentId = data.menuId
      dataForm.parentName = data.name
    }

    // 菜单树设置当前选中节点
    let menuListTreeRef = ref(null)
    const menuListTreeSetCurrentNode =() => {
      if (menuListTreeRef.value) {
        menuListTreeRef.value.setCurrentKey(dataForm.parentId)
      }
      dataForm.parentName = (menuListTreeRef.value.getCurrentNode() || {}).name
    }

    // 图标选中
    const iconActiveHandle = (iconName) => {
      dataForm.icon = iconName
    }

    // 表单提交
    const dataFormSubmit = () => {
      dataFormRef.validate((valid) => {
        if (valid) {
          http({
            url: http.adornUrl(`/sys/menu/${ !dataForm.id ? 'save' : 'update' }`),
            method: 'post',
            data: http.adornData({
              menuId: dataForm.id || undefined,
              type: dataForm.type,
              name: dataForm.name,
              parentId: dataForm.parentId,
              url: dataForm.url,
              perms: dataForm.perms,
              orderNum: dataForm.orderNum,
              icon: dataForm.icon
            })
          }).then(({ code, msg}) => {
            if (code === 200) {
              ctx.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  visible.value = false
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
      dataRule,
      iconList,
      dataFormRef,
      menuListTree,
      menuListTreeRef,
      menuListTreeProps,

      init,
      dataFormSubmit,
      iconActiveHandle,
      menuListTreeCurrentChangeHandle
    }
  }
}
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }

  &__icon-popover {
    width: 458px !important;
    overflow: hidden;
  }

  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;

    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;

      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
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

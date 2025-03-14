import qs from 'qs'
import { tagTypeMap } from '@/utils'
import { useCommonStore } from '@/store'
import { venusServer } from '@/utils/http'
import { commonApi } from '@/api/common-api'
import { ElMessage, ElMessageBox } from 'element-plus'
/**
 * 通用方法
 * @typedef {Object} CommonViewFns
 * @property {Function} isAuth - 权限校验
 * @property {Object} addOrUpdateRef - 组建引用
 * @property {Function} getDataList - 获取数据
 * @property {Function} deleteHandle - 删除数据
 * @property {Function} exportHandle - 导出数据
 * @property {Function} importHandle - 导入数据
 * @property {Function} pageNumChange - 页码改变
 * @property {Function} pageSizeChange - 页数改变
 * @property {Function} selectionChange - 选择改变
 * @property {Function} sortChangeHandle - 排序改变
 * @property {Function} addOrUpdateHandle - 新增/修改
 */

/**
 * 通用配置
 * @typedef {Object} CommonViewConfig
 * @property {Number} total - 总数
 * @property {Number} pageNum - 当前页
 * @property {Number} pageSize - 每页数量
 * @property {Array} dataList - 数据列表
 * @property {Object} dataForm - 查询表单
 * @property {Boolean} isPage - 是否分页
 * @property {String} [exportUrl] - 导出接口
 * @property {String} [importUrl] - 导入接口
 * @property {String} [deleteUrl] - 删除接口
 * @property {String} [dataListUrl] - 列表接口
 * @property {Boolean} [dataLoading] - 数据加载中
 * @property {Array} [dataSelections] - 选择的数据
 * @property {Boolean} [deleteIsBatch] - 是否批量删除
 * @property {Boolean} addOrUpdateVisible - 新增/修改弹窗显示
 * @property {Map<string, Map<number, string>>} dictMap - 字典数据
 * @property {Map<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'>} tagTypeMap - tag 类型
 */

const commonState = useCommonStore()

/**
 * 权限校验
 * @param {String} key
 * @returns {Boolean}
 */
export const isAuth = (key) => commonState.authList.includes(key)
/**
 * 通用表格配置
 * @param config {CommonViewConfig}
 * @returns {CommonViewFns & CommonViewConfig}
 */
const useView = (config) => {
  const defaultConfig = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 10,
    dataList: [],
    dataForm: {},
    isPage: true,
    dataLoading: true,
    dataSelections: [],
    deleteIsBatch: true,
    addOrUpdateVisible: false,
    addOrUpdateRefKey: 'addOrUpdateRef',
    tagTypeMap: tagTypeMap || new Map(),
    dictMap: commonState.dictMap || new Map()
  })

  /**
   * 合并配置项
   * @param options {CommonViewConfig}
   * @param config {CommonViewConfig}
   * @returns {CommonViewConfig}
   */
  const mergeOptions = (options, config) => Object.assign(config, options)

  const state = mergeOptions(config, defaultConfig)

  const queryDataList = () => {
    if (state.dataListUrl) {
      state.dataLoading = true
      commonApi(state.dataListUrl, {
        ...state.dataForm,
        pageNum: state.isPage ? state.pageNum : undefined,
        pageSize: state.isPage ? state.pageSize : undefined
      })
        .then((data) => {
          state.total = state.isPage ? data.total : 0
          state.dataList = state.isPage ? data.list : data
        })
        .finally(() => {
          state.dataLoading = false
        })
    }
  }
  // 获取数据列表
  const getDataList = () => {
    state.pageNum = 1
    queryDataList()
  }

  getDataList()

  const deleteHandle = (id = undefined) => {
    const ids = id ? [id] : state.dataSelections.map((item) => item.id)
    ElMessageBox.confirm(
      `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      commonApi(state.deleteUrl, state.deleteIsBatch ? { ids } : { id }, {
        method: 'delete'
      }).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            getDataList()
          }
        })
      })
    })
  }

  const exportHandle = (url, dataForm) => {
    location.href = url
      ? `${url}?${qs.stringify(Object.assign(dataForm || {}, { token: sessionStorage.getItem('token') }))}`
      : `${venusServer}${state.exportUrl}?${qs.stringify({ ...state.dataForm, token: sessionStorage.getItem('token') })}`
  }

  const importHandle = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    commonApi(state.importUrl, formData, {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getDataList()
        }
      })
    })
  }

  const pageNumChange = (value) => {
    state.pageNum = value
    queryDataList()
  }

  const pageSizeChange = (value) => {
    state.pageNum = 1
    state.pageSize = value
    queryDataList()
  }

  const selectionChange = (value) => {
    state.dataSelections = value
  }

  const sortChangeHandle = () => {}

  const addOrUpdateRef = useTemplateRef(state.addOrUpdateRefKey)
  const addOrUpdateHandle = async (id = undefined, pid = undefined) => {
    state.addOrUpdateVisible = true
    await nextTick(() => {
      addOrUpdateRef.value.init(id, pid)
    })
  }

  return {
    ...toRefs(state),
    isAuth,
    addOrUpdateRef,
    getDataList,
    deleteHandle,
    exportHandle,
    importHandle,
    pageNumChange,
    pageSizeChange,
    selectionChange,
    sortChangeHandle,
    addOrUpdateHandle
  }
}

export default useView

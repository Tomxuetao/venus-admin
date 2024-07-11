import { http, venusServer } from '@/utils/http'

/**
 * 获取参数列表
 * @param dataForm
 * @returns {*}
 */
export const sysParamsListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/params/page`,
  method: 'get',
  params: dataForm
})

/**
 * 保存参数信息
 * @param dataForm
 * @returns {*}
 */
export const saveSysParamsApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/params`,
  method: 'post',
  data: dataForm
})

/**
 * 修改参数信息
 * @param dataForm
 * @returns {*}
 */
export const updateSysParamsApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/params`,
  method: 'put',
  data: dataForm
})

/**
 * 删除参数信息
 * @param dataForm
 * @returns {*}
 */
export const deleteSysParamsApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/params`,
  method: 'delete',
  data: dataForm
})

/**
 * 导出参数信息
 * @param dataForm
 * @returns {*}
 */
export const exportSysParamsApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/params/export`,
  method: 'get',
  data: dataForm
})

/**
 * 导出参数信息
 * @param dataForm
 * @returns {*}
 */
export const sysParamsDetailApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/params/${dataForm.id}`,
  method: 'get'
})

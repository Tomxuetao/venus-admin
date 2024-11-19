import { http, venusServer } from '@/utils/http'

/**
 * 错误日志列表
 * @param dataForm
 * @returns {*}
 */
export const errorLogListApi = (dataForm = {}) =>
  http({
    url: `${venusServer}/sys/log/error/page`,
    method: 'get',
    params: dataForm
  })

/**
 * 导出错误日志
 */
export const exportErrorLogApi = () =>
  http({
    url: `${venusServer}/sys/log/error/export`,
    method: 'get',
    responseType: 'blob'
  })

/**
 * 登录日志列表
 * @param dataForm
 * @returns {*}
 */
export const loginLogListApi = (dataForm = {}) =>
  http({
    url: `${venusServer}/sys/log/login/page`,
    method: 'get',
    params: dataForm
  })

/**
 * 导出登录日志
 */
export const exportLoginLogApi = () =>
  http({
    url: `${venusServer}/sys/log/login/export`,
    method: 'get',
    responseType: 'blob'
  })

/**
 * 操作日志列表
 * @param dataForm
 * @returns {*}
 */
export const operationLogListApi = (dataForm = {}) =>
  http({
    url: `${venusServer}/sys/log/operation/page`,
    method: 'get',
    params: dataForm
  })

/**
 * 导出操作日志
 */
export const exportOperationLogApi = () =>
  http({
    url: `${venusServer}/sys/log/operation/export`,
    method: 'get',
    responseType: 'blob'
  })

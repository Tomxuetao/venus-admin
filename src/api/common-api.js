import { http, venusServer } from '@/utils/http'

/**
 * 通用api
 * @param url
 * @param {Object} dataForm 载荷对象
 * @param {AxiosRequestConfig | Object} config
 * @returns {Promise<AxiosResponse<any>>}
 */
export const commonApi = (url, dataForm = {}, config = { method: 'get' }) =>
  http({
    ...(config || {}),
    url: `${venusServer}${url}`,
    method: config?.method || 'get',
    ...(config?.method !== 'get'
      ? { data: dataForm || {} }
      : { params: dataForm || {} })
  })

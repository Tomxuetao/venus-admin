import {
 http, geoServer, venusServer 
} from '@/utils/http'

/**
 * 通用api
 * @param url
 * @param {Object} dataForm 载荷对象
 * @param {AxiosRequestConfig | Object} config
 * @returns {Promise<AxiosResponse<any>>}
 */
export const commonApi = (url, dataForm = {}, config = { method: 'get' }) => {
  const _innerConfig = Object.assign({ method: 'get' }, config || {})
  return http({
    ..._innerConfig,
    url: `${venusServer}${url}`,
    method: _innerConfig?.method || 'get',
    ...(_innerConfig?.method !== 'get'
      ? { data: dataForm || {} }
      : { params: dataForm || {} })
  })
}

/**
 * geoServerApi
 * @param url
 * @param dataForm
 * @param config
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const geoServerApi = (
  url,
  dataForm = {},
  config = { method: 'get' }
) => {
  const _innerConfig = Object.assign({ method: 'get' }, config || {})
  return http({
    ..._innerConfig,
    url: `${geoServer}${url}`,
    headers: {
      ...(config?.headers || {}),
      Authorization: `Basic ${btoa('admin:Wang#645678')}`
    },
    method: _innerConfig?.method || 'get',
    ...(_innerConfig?.method !== 'get'
      ? { data: dataForm || {} }
      : { params: dataForm || {} })
  })
}

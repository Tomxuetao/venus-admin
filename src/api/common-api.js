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
export const commonApi = (url, dataForm = {}, config = { method: 'get' }) =>
  http(
    Object.assign(
      { method: 'get', url: `${venusServer}${url}` },
      config || {},
      !config.method || config.method === 'get'
        ? { params: dataForm || {} }
        : { data: dataForm || {} }
    )
  )

/**
 * geoServerApi
 * @param url
 * @param dataForm
 * @param config
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const geoServerApi = (url, dataForm = {}, config = { method: 'get' }) =>
  http(
    Object.assign(
      {
        method: 'get',
        url: `${geoServer}${url}`
      },
      config || {},
      !config.method || config.method === 'get'
        ? { params: dataForm || {} }
        : { data: dataForm || {} },
      {
        headers: {
          ...(config.headers || {}),
          Authorization: 'Basic YWRtaW46V2FuZyM2NDU2Nzg='
        }
      }
    )
  )

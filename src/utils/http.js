import axios from 'axios'
import { ElMessage } from 'element-plus'
import { emitter } from '@/utils/emitter'

/**
 * 创建axios实例
 * @returns {AxiosInstance}
 */
export const createHttp = () => {
  const http = axios.create({
    timeout: 1000 * 3000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  /**
   * 请求拦截
   */
  http.interceptors.request.use(
    (config) => {
      if (config.url.includes(geoServer)) {
        config.headers = Object.assign(config.headers, {
          Authorization: `Basic ${btoa('admin:Wang#645678')}`
        })
      } else {
        config.headers = Object.assign(config.headers, {
          token: sessionStorage.getItem('token')
        })
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  /**
   * 响应拦截
   */
  http.interceptors.response.use(
    (response) => {
      const { request, headers, config } = response
      const { code, data, msg } = response.data
      if ([401, 403].includes(code)) {
        emitter.emit('no-access')
        return
      }
      if (request.responseType !== 'blob') {
        if (config.url.includes(geoServer)) {
          return response.data
        } else {
          if (code === 200) {
            return data
          } else {
            ElMessage.error(msg)
            return Promise.reject(msg)
          }
        }
      }

      return {
        downloadMethod: headers['content-disposition'],
        data: response.data
      }
    },
    (error) => Promise.reject(error)
  )

  return http
}

export const http = createHttp()

export const geoServer = '/geoserver'

export const venusServer = '/venus-api'

export const venusOssServer = '/venus-data'

import axios from 'axios'
import { ElMessage } from 'element-plus'

export const createHttp = () => {
  const http = axios.create({
    timeout: 1000 * 3,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  /**
   * 请求拦截
   */
  http.interceptors.request.use((config) => {
    config.headers = Object.assign(config.headers, { token: sessionStorage.getItem('token')})
    return config
  }, (error) => Promise.reject(error))

  /**
   * 响应拦截
   */
  http.interceptors.response.use((response) => {
    const { request, headers } = response
    const { code, data, msg } = response.data
    if (request.responseType !== 'blob') {
      if (code === 200) {
        return data
      } else {
        ElMessage.error(msg)
        return Promise.reject(msg)
      }
    }
   
    return { downloadMethod: headers['content-disposition'], data }
  }, (error) => Promise.reject(error))

  return http
}

export const http = createHttp()

export const venusServer = '/venus-api'

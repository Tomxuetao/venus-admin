import axios from 'axios'
import { ElMessage } from 'element-plus'

export function createHttp() {
  const http = axios.create({
    timeout: 1000 * 60,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
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
    const { code, data, msg } = response.data
    if (code === 0) {
      return data
    } else {
      ElMessage.error(msg)
      return Promise.reject(msg)
    }
  }, (error) => Promise.reject(error))

  return http
}

export const http = createHttp()

export const proxy = 'proxyApi'

import axios from 'axios'
import router from '@/router/index'
import { ElMessage } from 'element-plus'
import { executeOnce } from '@/utils/index'
import { ElMessageBox } from 'element-plus'

/**
 * 登录失效弹窗
 */
export const noAccessDialog = executeOnce(() => {
  ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).finally(async () => {
    sessionStorage.clear()
    await router.push({
      name: 'login'
    })
  })
})

/**
 * 创建axios实例
 * @returns {AxiosInstance}
 */
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
  http.interceptors.request.use(
    (config) => {
      config.headers = Object.assign(config.headers, {
        token: sessionStorage.getItem('token')
      })
      return config
    },
    (error) => Promise.reject(error)
  )

  /**
   * 响应拦截
   */
  http.interceptors.response.use(
    (response) => {
      const { request, headers } = response
      const { code, data, msg } = response.data
      if ([401].includes(code)) {
        noAccessDialog()
        return
      }
      if (request.responseType !== 'blob') {
        if (code === 200) {
          return data
        } else {
          ElMessage.error(msg)
          return Promise.reject(msg)
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

export const venusServer = '/venus-api'

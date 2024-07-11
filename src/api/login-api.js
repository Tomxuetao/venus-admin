import { http, venusServer } from '@/utils/http'

/**
 * 用户登录
 * @param dataForm
 * @returns {AxiosPromise}
 */
export const loginApi = (dataForm = {}) => http({
  url: `${venusServer}/login`,
  method: 'post',
  data: dataForm
})

export const sysUserDataApi = () => http({
  url: `${venusServer}/sys/user/info`,
  method: 'get'
})

/**
 * 用户退出
 * @returns {AxiosPromise}
 */
export const logoutApi = () => http({
  url: `${venusServer}/logout`,
  method: 'post'
})

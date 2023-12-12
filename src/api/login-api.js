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

/**
 * 获取验证码
 * @param dataForm
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCaptchaApi = (dataForm = {}) => http({
  url: `${venusServer}/captcha`,
  method: 'get',
  params: dataForm
})

/**
 * 用户退出
 * @returns {AxiosPromise}
 */
export const logoutApi = () => http({
  url: `${venusServer}/logout`,
  method: 'post'
})

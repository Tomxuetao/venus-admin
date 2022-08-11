import { http, proxy } from '@/utils/http'

/**
 * 用户登录
 * @param dataForm
 * @returns {AxiosPromise}
 */
export const loginApi = (dataForm = {}) => http({
	url: `${proxy}/login`,
	method: 'post',
	data: dataForm
})

/**
 * 用户退出
 * @returns {AxiosPromise}
 */
export const logoutApi = () => http({
	url: `${proxy}/logout`,
	method: 'post'
})

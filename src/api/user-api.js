import { http, proxy } from '@/utils/http'

export const sysUserListApi = (dataForm = {}) => http({
	url: `${proxy}/sys/user/list`,
	method: 'get',
	params: dataForm
})

export const sysUserDataApi = () => http({
	url: `${proxy}/sys/user/info`,
	method: 'get'
})

export const sysUserDetailApi = (dataForm = {}) => http({
	url: `${proxy}/sys/user/${dataForm.id}`,
	method: 'get'
})


export const sysUserSaveApi = (dataForm = {}) => http({
	url: `${proxy}/sys/user`,
	method: 'post',
	data: dataForm
})

export const sysUserUpdateApi = (dataForm = {}) => http({
	url: `${proxy}/sys/user`,
	method: 'put',
	data: dataForm
})

export const sysUserDeleteApi = (dataForm = {}) => http({
	url: `${proxy}/sys/user`,
	method: 'delete',
	data: dataForm
})

/**
 * 更新密码
 * @param dataForm
 * @returns {AxiosPromise}
 */
export const updatePswApi = (dataForm = {}) => http({
	url: `${proxy}/sys/user/password`,
	method: 'put',
	data: dataForm
})

export const sysUserExportApi = (dataForm = {}) => http({
	url: `${proxy}/sys/user/export`,
	method: 'get',
	params: dataForm
})

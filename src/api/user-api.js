import { http, venusServer } from '@/utils/http'

export const sysUserListApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/user/list`,
	method: 'get',
	params: dataForm
})

export const sysUserDataApi = () => http({
	url: `${venusServer}/sys/user/info`,
	method: 'get'
})

export const sysUserDetailApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/user/${dataForm.id}`,
	method: 'get'
})


export const saveSysUserApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/user`,
	method: 'post',
	data: dataForm
})

export const updateSysUserApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/user`,
	method: 'put',
	data: dataForm
})

export const deleteSysUserApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/user`,
	method: 'delete',
	data: dataForm
})

/**
 * 更新密码
 * @param dataForm
 * @returns {AxiosPromise}
 */
export const updatePswApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/user/password`,
	method: 'put',
	data: dataForm
})

export const exportSysUserApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/user/export`,
	method: 'get',
	params: dataForm
})

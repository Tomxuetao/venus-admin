import { http, venusServer } from '@/utils/http'

export const sysMenuNavApi = () => http({
	url: `${venusServer}/sys/menu/nav`,
	method: 'get'
})

export const sysMenuListApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/menu/list`,
	method: 'get',
	params: dataForm
})

export const sysMenuSelectApi = () => http({
	url: `${venusServer}/sys/menu/select`,
	method: 'get'
})

export const sysMenuDetailApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/menu/${dataForm.id}`,
	method: 'get'
})

export const saveSysMenuApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/menu`,
	method: 'post',
	data: dataForm
})

export const updateSysMenuApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/menu`,
	method: 'put',
	data: dataForm
})


export const deleteSysMenuApi = (dataForm = {}) => http({
	url: `${venusServer}/sys/menu/${dataForm.id}`,
	method: 'delete'
})

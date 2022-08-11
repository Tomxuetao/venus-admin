import { http, proxy } from '@/utils/http'

export const sysMenuNavApi = () => http({
	url: `${proxy}/sys/menu/nav`,
	method: 'get'
})

export const sysMenuListApi = (dataForm = {}) => http({
	url: `${proxy}/sys/menu/list`,
	method: 'get',
	params: dataForm
})

export const sysMenuSelectApi = () => http({
	url: `${proxy}/sys/menu/select`,
	method: 'get'
})

export const sysMenuDetailApi = (dataForm = {}) => http({
	url: `${proxy}/sys/menu/${dataForm.id}`,
	method: 'get'
})

export const sysMenuSaveApi = (dataForm = {}) => http({
	url: `${proxy}/sys/menu`,
	method: 'post',
	data: dataForm
})

export const sysMenuUpdateApi = (dataForm = {}) => http({
	url: `${proxy}/sys/menu`,
	method: 'put',
	data: dataForm
})


export const sysMenuDeleteApi = (dataForm = {}) => http({
	url: `${proxy}/sys/menu/${dataForm.id}`,
	method: 'delete'
})

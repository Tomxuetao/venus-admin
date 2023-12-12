import { http, venusServer } from '@/utils/http'

/**
 * 分页查询角色列表
 */
export const sysRolePageApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/role/page`,
  method: 'get',
  params: dataForm
})

/**
 * 获取角色列表-不分页
 * @param dataForm
 * @returns {*}
 */
export const sysRoleListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/role/list`,
  method: 'get',
  params: dataForm
})

/**
 * 保存角色
 * @param dataForm
 * @returns {*}
 */
export const saveSysRoleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/role/list`,
  method: 'post',
  data: dataForm
})

/**
 * 更新角色信息
 * @param dataForm
 * @returns {*}
 */
export const updateSysRoleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/role`,
  method: 'put',
  data: dataForm
})

export const sysRoleDetailApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/role/${dataForm.id}`,
  method: 'get'
})

/**
 * 删除系统角色
 * @param dataForm
 * @returns {*}
 */
export const deleteSysRoleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/role`,
  method: 'delete',
  data: dataForm
})

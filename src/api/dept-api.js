import { http, venusServer } from '@/utils/http'

/**
 * 获取部门列表
 * @param dataForm
 * @returns {*}
 */
export const sysDeptListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dept/list`,
  method: 'get',
  params: dataForm
})

/**
 * 保存部门信息
 * @param dataForm
 * @returns {*}
 */
export const saveSysDeptApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dept`,
  method: 'post',
  data: dataForm
})


/**
 * 修改部门信息
 * @param dataForm
 * @returns {*}
 */
export const updateSysDeptApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dept`,
  method: 'post',
  data: dataForm
})

/**
 * 获取部门详情
 * @param dataForm
 * @returns {*}
 */
export const sysDeptDetailApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dept/${dataForm.id}`,
  method: 'get'
})

/**
 * 删除部门信息
 * @param dataForm
 * @returns {*}
 */
export const deleteSysDeptApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dept/${dataForm.id}`,
  method: 'delete'
})

import { http, venusServer } from '@/utils/http'

/**
 * 获取字典类型列表
 * @param dataForm
 * @returns {*}
 */
export const sysDictListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/type/all`,
  method: 'get',
  params: dataForm
})

/**
 * 保存字典类型
 * @param dataForm
 * @returns {*}
 */
export const saveSysDictApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/type`,
  method: 'post',
  data: dataForm
})


/**
 * 保存字典类型
 * @param dataForm
 * @returns {*}
 */
export const updateSysDictApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/type`,
  method: 'put',
  data: dataForm
})

/**
 * 删除字典类型
 * @param dataForm
 * @returns {*}
 */
export const deleteSysDictApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/type`,
  method: 'delete',
  data: dataForm
})

/**
 * 分页查询字典类型
 * @param dataForm
 * @returns {*}
 */
export const sysDictPageApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/type/page`,
  method: 'get',
  params: dataForm
})

/**
 * 字典类型详情
 * @param dataForm
 * @returns {*}
 */
export const sysDictDetailApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/data/${dataForm.id}`,
  method: 'get'
})

/**
 * 获取字典数据列表
 * @param dataForm
 * @returns {*}
 */
export const dictDataListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/type/${dataForm.id}`,
  method: 'get'
})

/**
 * 保存字典数据
 * @param dataForm
 * @returns {*}
 */
export const savaDictDataApi =  (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/data`,
  method: 'post',
  data: dataForm
})

/**
 * 更新字典数据
 * @param dataForm
 * @returns {*}
 */
export const updateDictDataApi =  (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/data`,
  method: 'put',
  data: dataForm
})


/**
 * 删除字典数据
 * @param dataForm
 * @returns {*}
 */
export const deleteDictDataApi =  (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/data`,
  method: 'delete',
  data: dataForm
})


/**
 * 字典数据详情
 * @param dataForm
 * @returns {*}
 */
export const dictDataDetailApi =  (dataForm = {}) => http({
  url: `${venusServer}/sys/dict/data/${dataForm.id}`,
  method: 'get'
})

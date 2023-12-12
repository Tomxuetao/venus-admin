import { http, venusServer } from '@/utils/http'

/**
 * 获取云资源配置列表
 * @param dataForm
 * @returns {*}
 */
export const ossConfigListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/oss/page`,
  method: 'get',
  params: dataForm
})

/**
 * 获取详情
 * @param dataForm
 * @returns {*}
 */
export const ossConfigDetailApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/oss/info`,
  method: 'get',
  params: dataForm
})

/**
 * 保存云资源配置
 * @param dataForm
 * @returns {*}
 */
export const savaOssConfigApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/oss`,
  method: 'post',
  data: dataForm
})

/**
 * 删除上传文件记录（不会删除附件本身）
 * @param dataForm
 * @returns {*}
 */
export const deleteRecordApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/oss`,
  method: 'delete',
  data: dataForm
})

/**
 * 上传文件
 * @param dataForm
 * @returns {*}
 */
export const uploadFileApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/oss/upload`,
  method: 'post',
  data: dataForm
})

import { http, venusServer } from '@/utils/http'

/**
 * 获取定时任务列表
 * @param dataForm
 * @returns {*}
 */
export const scheduleListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule/page`,
  method: 'get',
  params: dataForm
})

/**
 * 保存定时任务
 * @param dataForm
 * @returns {*}
 */
export const saveScheduleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule`,
  method: 'post',
  data: dataForm
})

/**
 * 修改定时任务
 * @param dataForm
 * @returns {*}
 */
export const updateScheduleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule`,
  method: 'put',
  data: dataForm
})

/**
 * 删除定时任务
 * @param dataForm
 * @returns {*}
 */
export const deleteScheduleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule`,
  method: 'delete',
  data: dataForm
})


/**
 * 暂停定时任务
 * @param dataForm
 * @returns {*}
 */
export const pauseScheduleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule/pause`,
  method: 'put',
  data: dataForm
})


/**
 * 恢复定时任务
 * @param dataForm
 * @returns {*}
 */
export const resumeScheduleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule/resume`,
  method: 'put',
  data: dataForm
})

/**
 * 执行定时任务
 * @param dataForm
 * @returns {*}
 */
export const runScheduleApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule/run`,
  method: 'put',
  data: dataForm
})

/**
 * 定时任务详情
 * @param dataForm
 * @returns {*}
 */
export const scheduleDetailApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/schedule/${dataForm.id}`,
  method: 'get'
})

/**
 * 定时任务日志列表
 * @param dataForm
 * @returns {*}
 */
export const scheduleLogListApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/scheduleLog/page`,
  method: 'get',
  params: dataForm
})

/**
 * 定时任务日志详情
 * @param dataForm
 * @returns {*}
 */
export const scheduleLogDetailApi = (dataForm = {}) => http({
  url: `${venusServer}/sys/scheduleLog/${dataForm.id}`,
  method: 'get'
})

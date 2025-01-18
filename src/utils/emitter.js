import mitt from 'mitt'
import { executeOnce } from '@/utils/index'
import { ElMessageBox } from 'element-plus'

export const emitter = mitt()

/**
 * 登录失效弹窗
 */
export const noAccessDialog = executeOnce((msg = '登录已过期，请重新登录') => {
  ElMessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).finally(async () => {
    sessionStorage.clear()
    window.location.reload()
  })
})

/**
 * 创建EventSource
 * @type {(function(): void)|*}
 */
export const createEventSource = executeOnce((url) => {
  const eventSource = new EventSource(url, { withCredentials: true })

  eventSource.onmessage = ({ data }) => {
    try {
      emitter.emit('sse-msg', JSON.parse(data))
    } catch (e) {
      console.error(e.message)
    }
  }

  eventSource.onerror = (data) => {
    console.error(data)
  }
})

/**
 * SSE消息处理
 * @type {Map<number, function(*): void>}
 */
const msgHandlerMap = new Map([
  [1, (data) => console.log(data)],
  [0, (data) => noAccessDialog(data)]
])

emitter.on('sse-msg', (data) => {
  const handler = msgHandlerMap.get(data.type)
  if (handler) {
    handler(data.body)
  }
})

/**
 * 登录失效
 */
emitter.on('no-access', () => noAccessDialog())

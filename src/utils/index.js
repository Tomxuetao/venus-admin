import { ElMessage } from 'element-plus'

/**
 * 获取uuid
 */
export const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}

/**
 * URL地址
 * @param {*} s
 */
export const isURL = (s) => {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export const treeDataTranslate = (data, id = 'id', pid = 'pid') => {
  const res = []
  const temp = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]].children) {
        temp[data[k][pid]].children = []
      }
      if (!temp[data[k][pid]]._level) {
        temp[data[k][pid]]._level = 1
      }
      data[k]._level = temp[data[k][pid]]._level + 1
      temp[data[k][pid]].children.push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

export const buildTree = (nodes, parentId) => {
  const tree = []

  nodes.forEach((node) => {
    if (node.pid === parentId) {
      const children = buildTree(nodes, node.id)
      if (children.length) {
        node.children = children
      }
      tree.push(node)
    }
  })

  return tree
}

/**
 * 下载导出文件
 * @param fileData
 */
export const downloadExport = (fileData) => {
  const { data, downloadMethod } = fileData
  if (downloadMethod && downloadMethod.includes('=')) {
    const aDom = document.createElement('a')
    const tempArray = downloadMethod.split('=')
    aDom.download = decodeURI(tempArray[tempArray.length - 1])
    aDom.href = URL.createObjectURL(new Blob([data], { type: 'charset=utf-8' }))
    aDom.click()
  } else {
    ElMessage.error('下载文件失败')
  }
}

/**
 * 执行一次
 * @param fn
 * @returns {(function(): void)|*}
 */
export const executeOnce = (fn) => {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}

/**
 * 函数节流
 * @param {Function} fn
 * @param {number} delay
 * @returns {(function(...[*]): void)|*}
 */
export const throttle = (fn, delay) => {
  let timer
  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...args)
        timer = null
      }, delay)
    }
  }
}

/**
 * 函数防抖
 * @param {Function} fn
 * @param {number} delay
 * @returns {(function(...[*]): void)|*}
 */
export const debounce = (fn, delay = 100) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}

/**
 * 设置跟字体大小
 * @param {number} designHeight
 */
export const setRootFontSize = (designHeight = 1080) => {
  let docEl = document.documentElement
  let height = docEl.clientHeight
  docEl.style.fontSize = `${height / designHeight}px`
}

import { inject } from 'vue'
import router from '@/router'
import axios from 'axios'
import qs from 'qs'
import merge from 'lodash/merge'

export function createHttp () {
  const http = axios.create({
    timeout: 1000 * 30,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })

  /**
   * 请求拦截
   */
  http.interceptors.request.use(config => {
    config.headers.token = sessionStorage.getItem('token') // 请求头带上token
    return config
  }, error => {
    return Promise.reject(error)
  })

  /**
   * 响应拦截
   */
  http.interceptors.response.use(response => {
    const data = response.data
    if (data && data.code === 401) {
      // 401, token失效
      router.push({ name: 'login' }).then(() => {})
    }
    return data
  }, error => {
    return Promise.reject(error)
  })

  /**
   * 请求地址处理
   * @param {*} actionName action方法名称
   */
  http.adornUrl = (actionName) => {
    // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
    return (process.env.NODE_ENV !== 'production' ? '/proxyApi' : '') + actionName
  }

  /**
   * get请求参数处理
   * @param {*} params 参数对象
   * @param {*} openDefault 是否开启默认参数?
   */
  http.adornParams = (params = {}, openDefault = true) => {
    const defaults = {
      t: new Date().getTime()
    }
    return openDefault ? merge(defaults, params) : params
  }

  /**
   * post请求数据处理
   * @param {*} data 数据对象
   * @param {*} openDefault 是否开启默认数据?
   * @param {*} contentType 数据格式
   *  json: 'application/json; charset=utf-8'
   *  form: 'application/x-www-form-urlencoded; charset=utf-8'
   */
  http.adornData = (data = {}, openDefault = true, contentType = 'json') => {
    const defaults = {
      t: new Date().getTime()
    }
    data = openDefault ? merge(defaults, data) : data
    return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
  }

  http.install = function (app) {
    const http = this
    app.provide('vue-axios', http)
  }

  return http
}

export function useHttp () {
  return inject('vue-axios')
}

const http = createHttp()

export default http

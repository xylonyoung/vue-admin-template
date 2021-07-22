import axios from 'axios'
import store from '@/store'
import { MessageBox, Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { baseURL } from '@/config/settings'

// create an axios instance
const service = axios.create({
  baseURL: baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Auth-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      errorMessage(res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('error：', error?.response ?? error) // for debug

    switch (error?.response?.status) {
      case 403:
        errorMessage('没有权限！')
        break
      default:
        errorMessage('服务器繁忙!')
    }

    return Promise.reject(error)
  }
)
function errorMessage(message) {
  Message({
    message: message ?? '',
    type: 'error',
    duration: 5 * 1000
  })
}

export default service

import Vue from 'vue'
import request from './request'
import { dateFormat, numberFormat, getImage, getValue } from './index'

;(async function initialization() {
  vueUse()

  console?.log('%c🌈🌻🌼', 'font-size:48px;')
})()

/**
 * set global functions, variables, components, etc.
 */
function vueUse() {
  Vue.use({
    install(Vue) {
      Vue.prototype.$api = request
      Vue.prototype.$getValue = getValue
      Vue.prototype.$getImage = getImage
      Vue.prototype.$dateFormat = dateFormat
      Vue.prototype.$numberFormat = numberFormat
    }
  })
}

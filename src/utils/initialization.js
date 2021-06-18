import Vue from 'vue'
import request from '@/utils/request'
import lodash from 'lodash'
import { numberFormat, getImage, getValue } from './utils';

(async function initialization() {
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
      Vue.prototype.$numberFormat = numberFormat
      Vue.prototype.$_ = lodash
    }
  })
}

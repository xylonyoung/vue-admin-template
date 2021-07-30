import numbro from 'numbro'
import moment from 'moment'
import { baseURL } from '@/config'

/**
 * @param {(Date|String)} date
 * @returns {String}
 * https://momentjs.com/docs/#/displaying/format/
 */
export function dateFormat(date, token) {
  if (!date) return 'error date'
  return moment(date).format(token ?? 'YYYY-M-D H:m')
}

/**
 * @param {(Number|String)} num
 * @returns {string}
 * https://numbrojs.com/format.html
 */
export function numberFormat(num, option) {
  if (!num ?? isNaN(num)) return '0'

  const options = {
    thousandSeparated: true,
    trimMantissa: true,
    mantissa: 2,
    ...option
  }
  return numbro(num).format(options)
}

/**
 * @param {String} relativeURL
 * @returns {String}
 */
export function buildFullPath(relativeURL) {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
}

/**
 * @param {String} image
 * @returns {String}
 */
export function getImage(image) {
  const name = image?.__toString ?? image
  if (/^http/.test(name)) return name

  return buildFullPath(`/uploads/images/${name}`)
}

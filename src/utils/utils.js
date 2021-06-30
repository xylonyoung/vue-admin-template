import numbro from 'numbro'
import moment from 'moment'
import { baseURL } from '@/settings'

// https://momentjs.com/docs/#/displaying/format/
export function dateFormat(date, token) {
  if (!date) return 'error date'
  return moment(date).format(token ?? 'YYYY/M/D H:m')
}

// https://numbrojs.com/format.html
export function numberFormat(num, props) {
  const result = num ?? 0
  return numbro(result).format({
    thousandSeparated: true,
    trimMantissa: true,
    mantissa: 2,
    ...props
  })
}

export function buildFullPath(relativeURL) {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
}

export function getImage(image) {
  if (!image) return

  const name = image?.__toString ?? image
  if (/^http/.test(name)) return name

  return buildFullPath(`/uploads/images/${name}`)
}

/**
 * get the value in Object or Array
 * key include "." to separate
 * @param {Object | Array} param
 * @param {String} key
 * @returns {String | null}
 */
export function getValue(param, prop) {
  if (typeof param !== 'object' || typeof prop !== 'string') return null

  const keys = prop.split('.')

  let result = param

  for (const key of keys) {
    result = result?.[key]
    if (!result) break
  }

  return result ?? null
}

// export const ORDER_STATUS = {
//   '-2': '失败',
//   '-1': '已取消',
//   0: '等待',
//   1: '待支付',
//   2: '待发货',
//   3: '待收货',
//   4: '已收货',
//   5: '完成',
//   6: '售后中'
// }

export const COUPON_TYPE = { 0: '平台代金券', 1: '施工费用抵扣券' }

export const DELIVERY_SAMPLE_STATUS = { 0: '未送', 1: '已送' }

export const ORDER_STATUS = {
  0: '待提交',
  1: '待支付',
  2: '待指派',
  3: '待施工',
  4: '待验收评价',
  5: '已完成'
}

export function constantForSelect(constant) {
  const result = []
  for (const key in constant) {
    result.push({ label: constant[key], value: Number(key) })
  }
  return result
}

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

export const ROLES_LIST = { ROLE_SUPER_ADMIN: '管理员', ROLE_USER: '用户' }

export const COUPON_TYPE = { 0: '平台代金券', 1: '施工费用抵扣券' }

export const DELIVERY_SAMPLE_STATUS = {
  '-1': '已取消',
  0: '未送',
  1: '待送',
  2: '已送',
  3: '已签收'
}

export const ORDER_STATUS = {
  '-1': '已取消',
  0: '待提交',
  1: '待支付',
  2: '待接工',
  3: '待完工',
  4: '待验收',
  5: '待完成',
  6: '待接单'
}

export function getConstantOptions(constant) {
  const result = []
  for (const key in constant) {
    result.push({ label: constant[key], value: Number(key) || key })
  }
  return result
}

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

export const COUPON_TYPE = {
  0: '平台代金券',
  1: '施工费用抵扣券',
  2: '平台通用券'
}

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
  2: '待平台接单',
  3: '待确认上门时间',
  4: '已完工',
  5: '待完成',
  6: '待工人接单',
  21: '待指派工人',
  31: '待上门施工',
  32: '施工中'
}

export const ORDER_TYPE = {
  construction: '施工订单',
  measure: '测量订单'
}

export const ORDER_WALL_TYPE = {
  0: '腻子墙面',
  1: '乳胶漆墙面'
}

export const ORDER_HAS_SCALING = {
  0: '无掉灰',
  1: '有掉灰'
}

export const ORDER_HAS_FURNITURE = {
  0: '有家具',
  1: '无家具'
}

export const ORDER_SPECIAL_WALL = {
  1: '特殊造型'
}

export function getConstantOptions(constant) {
  const result = []
  for (const key in constant) {
    result.push({ label: constant[key], value: Number(key) || key })
  }
  return result
}

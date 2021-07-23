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

export const CANTEEN_STATUS = { 0: '未歇业', 1: '营业中' }

export const STAFF_STATUS = { 0: '离职', 1: '在职' }

export function getConstantOptions(constant) {
  const result = []
  for (const key in constant) {
    result.push({ label: constant[key], value: Number(key) || key })
  }
  return result
}

export const CANTEEN_STATUS = ['未歇业', '营业中']

export const STAFF_STATUS = ['离职', '在职']

export function constantForSelect(constant) {
  if (Array.isArray(constant)) {
    return constant.map((e, index) => ({ label: e, value: index }))
  }

  return Object.keys(constant).map(e => ({ label: constant[e], value: e }))
}

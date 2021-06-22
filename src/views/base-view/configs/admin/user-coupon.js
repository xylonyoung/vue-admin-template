export default {
  tableConfig: ['id', 'coupon', 'expiredTime', 'isUsed', 'user'],

  formConfig: ['coupon', { property: 'isUsed', default: false }, 'user']
}

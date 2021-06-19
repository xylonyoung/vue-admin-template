export default {
  tableConfigs: ['id', 'coupon', 'expiredTime', 'isUsed', 'user'],

  formConfigs: ['coupon', { property: 'isUsed', default_value: false }, 'user']
}

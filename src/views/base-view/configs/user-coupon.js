export default {
  listDisplay: ['id', 'coupon', 'expiredTime', 'isUsed', 'user'],

  formFields: ['coupon', { property: 'isUsed', default_value: false }, 'user']
}

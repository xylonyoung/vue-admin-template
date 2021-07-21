export default {
  querierConfig: [
    {
      type: 'input',
      property: 'user.username',
      props: { placeholder: '请输入用户名' }
    }
  ],

  tableConfig: ['id', 'coupon', 'expiredTime', 'isUsed', 'user'],

  formConfig: ['coupon', { property: 'isUsed', default: false }, 'user']
}

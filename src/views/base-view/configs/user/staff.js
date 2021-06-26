export default {
  tableConfig: [
    'id',
    'balance',
    'business',
    'name',
    'phone',
    { property: 'status', type: 'status', status: ['状态0', '状态1', '状态2'] },
    'user'
  ],

  formConfig: ['balance', 'business', 'name', 'phone', 'status', 'user']
}

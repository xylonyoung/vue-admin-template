export default {
  tableConfig: [
    'id',
    'balance',
    'business',
    'name',
    'phone',
    { property: 'status', type: 'status', status: ['a', 'b', 'c'] },
    'user'
  ],

  formConfig: ['balance', 'business', 'name', 'phone', 'status', 'user']
}

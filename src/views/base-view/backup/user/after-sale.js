export default {
  tableConfig: ['id', 'issue', 'order', 'pictures', 'status', 'user'],

  formConfig: [
    'issue',
    'order',
    { property: 'pictures', type: 'upload' },
    'user'
  ]
}

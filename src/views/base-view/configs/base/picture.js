export default {
  tableConfig: [
    'id',
    { property: 'image', type: 'image' },
    'title',
    'type',
    'createTime'
  ],

  formConfig: ['title', 'type', { property: 'image', type: 'image' }]
}

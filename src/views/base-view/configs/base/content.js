export default {
  listQuery: {
    '@order': 'id|DESC'
  },

  tableConfig: [
    'id',
    { property: 'cover', type: 'image' },
    'category',
    'title',
    { property: 'enabled', label: '是否启用', type: 'boolean' },
    'createdTime'
  ],

  formConfig: [
    'title',
    'category',
    { property: 'cover', type: 'image' },
    {
      property: 'enabled',
      label: '是否启用',
      type: 'boolean'
    },
    { property: 'content', type: 'textarea' }
  ]
}

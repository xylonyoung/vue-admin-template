export default {
  listQuery: {
    '@order': 'id|DESC'
  },

  tableConfig: [
    'id',
    { property: 'cover', type: 'image' },
    'category',
    'title',
    { property: 'enabled', type: 'boolean' },
    'createdTime'
  ],

  formConfig: [
    'title',
    'category',
    { property: 'cover', type: 'image' },
    {
      property: 'enabled',
      type: 'boolean'
    },
    { property: 'content', type: 'textarea' }
  ]
}

export default {
  listQuery: {
    '@order': 'id|DESC'
  },

  tableConfig: [
    'id',
    'title',
    { property: 'enabled', type: 'boolean' },
    'content'
  ],

  formConfig: [
    'title',
    {
      property: 'enabled',
      type: 'boolean',
      default: true
    },
    'content'
  ]
}

export default {
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
    // 'category',
    {
      property: 'category',
      filter: {
        '@filter': 'entity.getType().getSlug() == "content"',
        '@order': 'id|ASC'
      }
    },
    { property: 'cover', type: 'upload' },
    {
      property: 'enabled',
      type: 'boolean'
    },
    { property: 'content', type: 'textarea' }
  ]
}

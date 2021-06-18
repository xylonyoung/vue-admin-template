export default {
  listQuery: {
    '@order': 'id|DESC'
  },

  listDisplay: [
    'id',
    { property: 'cover', type: 'image' },
    'category',
    { property: 'group', type: 'string', label: '可看组别' },
    'title',
    { property: 'enabled', label: '是否启用' },
    'createdTime'
  ],

  formFields: [
    'title',
    {
      property: 'category',
      relation_filter: {
        '@filter':
          'entity.getType().getSlug() == "PROGRAMME" || entity.getType().getSlug() == "ARTICLE" || entity.getType().getSlug() == "RECRUIEMENT"',
        '@order': 'id|ASC'
      }
    },
    {
      property: 'group',
      field_options: { label: '可看组别' },
      relation_filter: {
        '@filter':
          'entity.getType().getSlug() == "RECRUIEMENT_SOURCES" || entity.getType().getSlug() == "CHANNEL_SOURCES"',
        '@order': 'id|ASC'
      }
    },
    { property: 'cover', type: 'image' },
    {
      property: 'enabled',
      type: 'boolean',
      field_options: { label: '是否启用' }
    },
    { property: 'content', type: 'textarea' }
  ]
}

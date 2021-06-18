export default {
  querierConfig: [
    {
      type: 'select',
      property: 'type.id',
      props: {
        placeholder: '请选类型'
      },
      getOptions: { api: 'manage/types', label: 'name', value: 'id' }
    }
  ],

  listDisplay: ['id', 'type', 'name', 'parent', 'enabled', 'sequence'],

  formFields: [
    'name',
    'title',
    'subTitle',
    'type',
    { property: 'parent', required: false },
    { property: 'enabled', required: false, default_value: true },
    { property: 'sequence', required: false, default_value: 0 },
    { property: 'icon', required: false, type: 'image' }
  ]
}

export default {
  querierConfig: [
    {
      type: 'select',
      property: 'type.id',
      props: {
        placeholder: '请选类型'
      },
      getOptions: { api: '/manage/types', label: 'name', value: 'id' }
    }
  ],

  tableConfig: [
    'id',
    'type',
    'name',
    'parent',
    'enabled',
    'sequence',
    { property: 'icon', type: 'image' }
  ],

  formConfig: [
    'name',
    'title',
    'subTitle',
    { property: 'icon', type: 'upload', config: { dataType: 'string' }},
    'type',
    'parent',
    { property: 'enabled', default: true },
    { property: 'sequence', default: 0 }
  ]
}

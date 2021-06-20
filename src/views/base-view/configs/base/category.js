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

  tableConfig: ['id', 'type', 'name', 'parent', 'enabled', 'sequence'],

  formConfig: [
    'name',
    'title',
    'subTitle',
    'type',
    { property: 'parent', required: false },
    { property: 'enabled', required: false, default: true },
    { property: 'sequence', required: false, default: 0 },
    { property: 'icon', required: false, type: 'image' }
  ]
}

export default {
  tableConfig: ['id', { property: 'pictures', type: 'image' }, 'title', 'type'],

  formConfig: [
    'title',
    'type',
    { property: 'pictures', type: 'upload' },
    'comment'
  ]
}

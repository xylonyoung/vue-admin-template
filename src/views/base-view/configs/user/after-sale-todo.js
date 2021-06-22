import ImageRender from '../../components/table/ImageRender'

export default {
  hasTodo: true,

  disabledActions: ['new', 'delete', 'edit'],

  listDisplay: [
    'id',
    'issue',
    'order',
    { property: 'pictures', component: ImageRender() },
    'status',
    'user'
  ]
}

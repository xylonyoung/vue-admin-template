import Uploader from '../../components/form/Uploader'
import ImageRender from '../../components/table/ImageRender'

export default {
  listDisplay: [
    'id',
    'issue',
    'order',
    { property: 'pictures', component: ImageRender() },
    'status',
    'user'
  ],

  formFields: [
    'issue',
    'order',
    { property: 'pictures', component: Uploader() },
    'user'
  ]
}

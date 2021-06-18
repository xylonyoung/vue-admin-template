import Uploader from '../../components/form/Uploader'
import ImageRender from '../../components/table/ImageRender'

export default {
  listDisplay: [
    'id',
    { property: 'pictures', component: ImageRender() },
    'title',
    'type'
  ],

  formFields: [
    'title',
    'type',
    { property: 'pictures', component: Uploader() },
    'comment'
  ]
}

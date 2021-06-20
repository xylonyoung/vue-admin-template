import Uploader from '../components/form/Uploader'
import ImageRender from '../components/table/ImageRender'

export default {
  tableConfig: [
    'id',
    'issue',
    'order',
    { property: 'pictures', component: ImageRender() },
    'status',
    'user'
  ],

  formConfig: [
    'issue',
    'order',
    { property: 'pictures', component: Uploader() },
    'user'
  ]
}

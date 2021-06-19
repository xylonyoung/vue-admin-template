import Uploader from '../../components/form/Uploader'
import ImageRender from '../../components/table/ImageRender'

export default {
  tableConfigs: [
    'id',
    { property: 'pictures', component: ImageRender() },
    'title',
    'type'
  ],

  formConfigs: [
    'title',
    'type',
    { property: 'pictures', component: Uploader() },
    'comment'
  ]
}

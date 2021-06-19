import Uploader from '../../components/form/Uploader'
import ImageRender from '../../components/table/ImageRender'

export default {
  tableConfigs: [
    'id',
    { property: 'image', component: ImageRender() },
    'title',
    'type',
    'createTime'
  ],

  formConfigs: ['title', 'type', { property: 'image', component: Uploader({ dataType: 'string' }) }]
}

import Uploader from '../../components/form/Uploader'
import ImageRender from '../../components/table/ImageRender'

export default {
  listDisplay: [
    'id',
    { property: 'image', component: ImageRender() },
    'title',
    'type',
    'createTime'
  ],

  formFields: ['title', 'type', { property: 'image', component: Uploader({ dataType: 'string' }) }]
}

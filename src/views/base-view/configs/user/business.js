import { Region } from '../../components/form/Region'
import Uploader from '../../components/form/Uploader'
import ImageRender from '../../components/table/ImageRender'

export default {
  disabledActions: ['action'],

  querierConfig: [
    {
      type: 'input',
      property: 'name',
      props: { placeholder: '请输入名称' }
    },
    {
      type: 'input',
      property: 'region.__toString',
      props: { placeholder: '请输入区域' }
    }
  ],

  listDisplay: [
    'id',
    'address',
    'category',
    'description',
    'name',
    'phone',
    { property: 'photo', component: ImageRender() },
    'region',
    'user'
  ],

  formFields: [
    'address',
    'category',
    'description',
    'name',
    'phone',
    { property: 'photo', component: Uploader({ dataType: 'string' }) },
    { property: 'region', component: Region() },
    'user'
  ]
}

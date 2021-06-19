import { Region } from '../components/form/Region'

export default {
  tableConfigs: [
    'id',
    'name',
    'phone',
    'user',
    'region',
    'isContacted',
    'type',
    'comment'
  ],

  formConfigs: [
    'name',
    'phone',
    'user',
    { property: 'region', component: Region() },
    'isContacted',
    'type',
    'comment'
  ]
}

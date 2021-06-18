import { Region } from '../components/form/Region'

export default {
  listDisplay: [
    'id',
    'name',
    'phone',
    'user',
    'region',
    'isContacted',
    'type',
    'comment'
  ],

  formFields: [
    'name',
    'phone',
    'user',
    { property: 'region', component: Region() },
    'isContacted',
    'type',
    'comment'
  ]
}

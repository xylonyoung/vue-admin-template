import { Region } from '@/components/Region'

export default {
  tableConfig: [
    'id',
    'name',
    'phone',
    'user',
    'region',
    'isContacted',
    'type',
    'comment'
  ],

  formConfig: [
    'name',
    'phone',
    'user',
    {
      property: 'region',
      component: Region()
    },
    'isContacted',
    'type',
    'comment'
  ]
}

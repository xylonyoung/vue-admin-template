import { STAFF_STATUS, constantForSelect } from '@/constants'
import Select from '../../components/Select'

export default {
  tableConfig: [
    'id',
    'balance',
    'business',
    'name',
    'phone',
    { property: 'status', type: 'status', status: STAFF_STATUS },
    'user'
  ],

  formConfig: [
    'balance',
    'business',
    'name',
    'phone',
    {
      property: 'status',
      options: constantForSelect(STAFF_STATUS),
      component: Select()
    },
    'user'
  ]
}

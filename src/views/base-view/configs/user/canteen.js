import Select from '../../components/Select'
import { CANTEEN_STATUS, constantForSelect } from '../../constants'

export default {
  tableConfig: [
    'id',
    'name',
    'no',
    'contact',
    'phone',
    { property: 'status', type: 'status', status: CANTEEN_STATUS }
  ],

  formConfig: [
    'contact',
    'description',
    'name',
    'no',
    {
      property: 'phases',
      option: 'phases',
      component: Select({ props: { multiple: true }})
    },
    'phone',
    {
      property: 'status',
      options: constantForSelect(CANTEEN_STATUS),
      component: Select()
    }
  ]
}

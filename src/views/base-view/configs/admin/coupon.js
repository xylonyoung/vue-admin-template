import { COUPON_TYPE, getConstantOptions } from '@/constants'
import ShowValue from '@/components/Base/Table/ShowValue'

export default {
  tableConfig: [
    'id',
    'name',
    'condition',
    'description',
    'discount',
    'duringDay',
    'enabled',
    'image',
    'imageFile',
    'threshold',
    {
      property: 'type',
      component: ShowValue(COUPON_TYPE)
    },
    'userLimit'
  ],

  formConfig: [
    'name',
    'condition',
    'description',
    'discount',
    'duringDay',
    'enabled',
    'image',
    'imageFile',
    'pickUpStartTime',
    'pickUpEndTime',
    'threshold',
    {
      property: 'type',
      type: 'OneToOne',
      options: getConstantOptions(COUPON_TYPE)
    },
    'userLimit'
  ]
}

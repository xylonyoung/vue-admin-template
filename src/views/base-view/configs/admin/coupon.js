import { COUPON_TYPE, getConstantOptions } from '@/constants'

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
      component: {
        props: ['value'],
        render(h) {
          return <span>{COUPON_TYPE[this.value]}</span>
        }
      }
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

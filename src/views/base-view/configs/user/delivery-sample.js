import { DELIVERY_SAMPLE_STATUS, getConstantOptions } from '@/constants'
import deliverySample from '../admin/delivery-sample'

export default {
  disableActions: ['delete'],

  ...deliverySample,

  formConfig: [
    {
      property: 'status',
      type: 'OneToOne',
      options: getConstantOptions(DELIVERY_SAMPLE_STATUS)
    }
  ]
}

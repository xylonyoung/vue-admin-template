import { DELIVERY_SAMPLE_STATUS, getConstantOptions } from '@/constants'
import RowDetail from '@/components/Base/Table/RowDetail'
import {
  DeliverySampleStatus,
  DeliverySampleQuerierConfig
} from '../admin/delivery-sample'

export default {
  disableActions: ['action', 'new'],

  querierConfig: DeliverySampleQuerierConfig,

  tableConfig: [
    'id',
    'createdTime',
    'quantity',
    DeliverySampleStatus,
    {
      label: '查看',
      component: RowDetail([
        'address',
        'business',
        'comment',
        'name',
        'no',
        'phone',
        'price',
        'region',
        'user',
        DeliverySampleStatus
      ])
    }
  ],

  formConfig: [
    {
      property: 'status',
      type: 'OneToOne',
      options: getConstantOptions(DELIVERY_SAMPLE_STATUS)
    }
  ]
}

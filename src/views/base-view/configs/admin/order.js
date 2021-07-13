import {
  ORDER_STATUS,
  ORDER_TYPE,
  ORDER_WALL_TYPE,
  ORDER_HAS_SCALING,
  ORDER_HAS_FURNITURE,
  ORDER_SPECIAL_WALL,
  getConstantOptions
} from '@/constants'
import RowDetail from '@/components/RowDetail'

export default {
  querierConfig: [
    {
      type: 'date',
      property: 'createdTime',
      props: { type: 'daterange' }
    },
    {
      type: 'input',
      property: 'phone',
      props: { placeholder: '请输入电话' }
    },
    {
      type: 'select',
      property: 'status',
      props: { placeholder: '请选订单状态' },
      options: getConstantOptions(ORDER_STATUS)
    },
    {
      type: 'input',
      property: 'region',
      props: { placeholder: '请输入地区' }
    },
    {
      type: 'input',
      property: 'worker.name',
      props: { placeholder: '请输入施工工人' }
    }
  ],

  tableConfig: [
    'id',
    {
      label: '查看',
      component: RowDetail([
        {
          property: 'type',
          type: 'constant',
          constant: ORDER_TYPE
        },
        {
          property: 'status',
          type: 'constant',
          constant: ORDER_STATUS
        },
        'createdTime',
        'region',
        'address',
        'contact',
        'phone',
        'worker',
        'totalPrice',
        'discount',
        'shippingPrice',
        'price',
        'pickupAddress',
        'pickupCode',
        {
          property: 'wallType',
          type: 'constant',
          constant: ORDER_WALL_TYPE
        },
        {
          property: 'hasScaling',
          type: 'constant',
          constant: ORDER_HAS_SCALING
        },
        {
          property: 'hasFurniture',
          type: 'constant',
          constant: ORDER_HAS_FURNITURE
        },
        {
          property: 'specialWall',
          type: 'constant',
          constant: ORDER_SPECIAL_WALL
        },
        {
          property: 'specialWallPhoto',
          type: 'image'
        },
        {
          property: 'environmentPhoto',
          type: 'image'
        },
        'measureResult',
        {
          property: 'finishPhoto',
          type: 'image'
        }
      ])
    }
  ],

  formConfig: [''],

  downloadConfig: {
    api: '/provider/orders',
    filename: '订单',
    tHeader: [
      '下单时间',
      '地区',
      '类型',
      '地址',
      '联系人',
      '联系电话',
      '订单状态',
      '服务总价',
      '订单折扣',
      '代付运费',
      '实收金额',
      '施工工费',
      '下单用户',
      '施工工人',
      '订单备注'
    ],
    filterVal: [
      'createdTime',
      'region',
      'type',
      'address',
      'contact',
      'phone',
      'status',
      'totalPrice',
      'discount',
      'shippingPrice',
      'price',
      'workerFee',
      'user',
      'worker',
      'comment'
    ],
    formatFunc(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          switch (j) {
            case 'type':
              return this.type[v[j]]
            case 'createdTime':
              return this.$dateFormat(v[j])
            default:
              return v[j]?.__toString ?? v[j]
          }
        })
      )
    }
  }
}

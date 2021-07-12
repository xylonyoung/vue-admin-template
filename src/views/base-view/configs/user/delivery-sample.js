import { DELIVERY_SAMPLE_STATUS, getConstantOptions } from '@/constants'
import RowDetail from '@/components/RowDetail'

export default {
  disableActions: ['action', 'new'],

  querierConfig: [
    {
      type: 'date',
      property: 'createdTime',
      props: { placeholder: '请选择时间' }
    }
  ],

  tableConfig: [
    'id',
    'createdTime',
    'quantity',
    {
      property: 'status',
      component: {
        props: ['value'],
        render(h) {
          return (
            <el-tag type={this.value > 0 ? 'success' : 'danger'}>
              {DELIVERY_SAMPLE_STATUS[this.value]}
            </el-tag>
          )
        }
      }
    },
    {
      label: '查看',
      property: 'status',
      component: RowDetail([
        'address',
        'business',
        'comment',
        'name',
        'no',
        'phone',
        'price',
        'region',
        {
          property: 'status',
          component: {
            props: ['value'],
            render(h) {
              return (
                <el-tag type={this.value > 0 ? 'success' : 'danger'}>
                  {DELIVERY_SAMPLE_STATUS[this.value]}
                </el-tag>
              )
            }
          }
        },
        'user'
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

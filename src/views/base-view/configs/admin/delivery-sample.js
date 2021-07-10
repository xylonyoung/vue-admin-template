import { DELIVERY_SAMPLE_STATUS, getConstantOptions } from '@/constants'
import { Region } from '@/components/Region'

export default {
  querierConfig: [
    {
      type: 'input',
      property: 'name',
      props: { placeholder: '请输入名称' }
    },
    {
      type: 'input',
      property: 'region.__toString',
      props: { placeholder: '请输入区域' }
    },
    {
      type: 'input',
      property: 'phone',
      props: { placeholder: '请输入电话' }
    }
  ],

  tableConfig: [
    'id',
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
          console.log()
          return (
            <el-tag type={this.value > 0 ? 'success' : 'danger'}>
              {DELIVERY_SAMPLE_STATUS[this.value]}
            </el-tag>
          )
        }
      }
    },
    'user'
  ],

  formConfig: [
    'address',
    'business',
    'comment',
    'name',
    'no',
    'phone',
    'price',
    {
      property: 'region',
      component: Region()
    },
    {
      property: 'status',
      type: 'OneToOne',
      options: getConstantOptions(DELIVERY_SAMPLE_STATUS)
    },
    'user'
  ]
}

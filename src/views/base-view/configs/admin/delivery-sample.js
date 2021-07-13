import { DELIVERY_SAMPLE_STATUS, getConstantOptions } from '@/constants'
import { Region } from '@/components/Region'

export const DeliverySampleStatus = {
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
}

export const DeliverySampleQuerierConfig = [
  {
    type: 'date',
    property: 'createdTime',
    props: { placeholder: '请选择时间' }
  },
  {
    default: ['status', 'entity.getStatus() > 0'],
    component: {
      props: ['func'],
      render(h) {
        return (
          <el-checkbox v-model={this.checked} onChange={this.onChange}>
            全部
          </el-checkbox>
        )
      },
      data() {
        return {
          checked: false
        }
      },
      methods: {
        onChange(val) {
          let result = 'entity.getStatus() > 0'
          if (val) {
            result = ''
          }
          this.func('status', result)
        }
      }
    }
  }
]

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
    },
    ...DeliverySampleQuerierConfig
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
    'user',
    DeliverySampleStatus
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

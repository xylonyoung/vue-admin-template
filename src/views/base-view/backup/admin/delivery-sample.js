import { DELIVERY_SAMPLE_STATUS } from '@/constants'

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
        props: ['data'],
        render(h) {
          return (
            <el-tag type={this.data ? 'success' : 'danger'}>
              {DELIVERY_SAMPLE_STATUS[this.data]}
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
    'region',
    {
      property: 'status',
      component: {
        props: ['form'],
        render(h) {
          return (
            <el-select v-model={this.form.status} placeholder='请选择'>
              {DELIVERY_SAMPLE_STATUS.map((e, index) => (
                <el-option label={e} value={index}></el-option>
              ))}
            </el-select>
          )
        }
      }
    },
    'user'
  ]
}

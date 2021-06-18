const COUPON_TYPE = ['平台代金券', '施工费用抵扣券']
export default {
  listDisplay: [
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
        props: ['data'],
        render(h) {
          return <span>{COUPON_TYPE[this.data]}</span>
        }
      }
    },
    'userLimit'
  ],

  formFields: [
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
      component: {
        props: ['form'],
        render(h) {
          return (
            <el-select v-model={this.form.type} placeholder='请选择'>
              {COUPON_TYPE.map((e, index) => (
                <el-option label={e} value={index.toString()}></el-option>
              ))}
            </el-select>
          )
        }
      }
    },
    'userLimit'
  ]
}

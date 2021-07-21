export default {
  querierConfig: [
    {
      type: 'select',
      property: 'type.id',
      props: {
        placeholder: '请选类型'
      },
      getOptions: { api: '/manage/types', label: 'name', value: 'id' }
    }
  ],

  tableConfig: [
    'id',
    'type',
    'name',
    'parent',
    'enabled',
    'sequence',
    { property: 'icon', type: 'image' },
    {
      property: 'extraData',
      label: '面积系数',
      component: {
        props: ['value'],
        render(h) {
          return <span>{this.value?.coefficient}</span>
        }
      }
    }
  ],

  formConfig: [
    'name',
    'title',
    'subTitle',
    { property: 'icon', type: 'upload', config: { dataType: 'string' }},
    'type',
    'parent',
    { property: 'enabled', default: true },
    { property: 'sequence', default: 0 },
    {
      property: 'extraData',
      label: '面积系数',
      component: {
        props: ['value'],
        render(h) {
          return (
            <el-input-number
              v-model={this.coefficient}
              onChange={this.onChange}
              precision={2}
            ></el-input-number>
          )
        },
        data() {
          return {
            coefficient: 1
          }
        },
        created() {
          const result = this.value?.coefficient
          if (result) {
            this.coefficient = result
          } else {
            this.coefficient = 1
          }
        },
        methods: {
          onChange(val) {
            this.$emit('input', JSON.stringify({ coefficient: val }))
          }
        }
      }
    }
  ]
}

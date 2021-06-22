import RegionsList from '../../components/table/RegionsList'

export default {
  disabledActions: ['delete'],

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
    {
      type: 'select',
      property: 'enabled',
      props: {
        placeholder: '请选择状态',
        style: 'width:120px'
      },
      options: [
        {
          value: true,
          label: '激活'
        },
        {
          value: false,
          label: '未激活'
        }
      ]
    }
  ],

  listDisplay: [
    'id',
    { property: 'regions', component: RegionsList() },
    'name',
    'phone',
    'enabled',
    'comment'
  ],

  formFields: ['enabled', 'comment']
}

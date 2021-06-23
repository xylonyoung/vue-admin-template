export default {
  disableActions: ['delete'],

  querierConfig: [
    {
      type: 'input',
      property: 'nickname',
      props: { placeholder: '请输入昵称' }
    },
    {
      type: 'input',
      property: 'phone',
      props: { placeholder: '请输入电话' }
    }
  ],

  listQuery: {
    '@order': 'id|DESC'
  },

  tableConfig: [
    'id',
    { property: 'portraitUrl', type: 'image' },
    'nickname',
    'phone',
    'user'
  ],

  formConfig: ['user', 'nickname', 'phone']
}

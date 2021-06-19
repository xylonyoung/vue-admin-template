import ImageRender from '../../components/table/ImageRender'

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

  tableConfigs: [
    'id',
    { property: 'avatarUrl', component: ImageRender(true) },
    'nickname',
    'phone',
    'user'
  ],

  formConfigs: ['user', 'nickname', 'phone']
}

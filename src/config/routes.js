// dynamicRoutes property must same as roles
const dynamicRoutes = {}

dynamicRoutes.manage = [
  // common pages
  {
    path: 'user',
    title: '用户',
    icon: 'el-icon-user-solid',
    children: [
      { path: '', entity: 'User', title: '用户权限' },
      { path: 'profile', entity: 'UserProfile', title: '用户资料' }
    ]
  },
  // {
  //   path: 'feedback',
  //   entity: 'Feedback',
  //   title: '反馈',
  //   icon: 'el-icon-document'
  // },
  {
    path: 'content',
    entity: 'Content',
    title: '公告',
    icon: 'el-icon-document'
  },
  {
    path: 'pictures',
    title: '图片',
    icon: 'el-icon-picture',
    children: [
      { path: 'album', entity: 'Album', title: '相册' },
      { path: 'picture', entity: 'Picture', title: '图片' }
    ]
  },
  {
    path: 'system',
    title: '系统选项',
    icon: 'el-icon-setting',
    children: [
      { path: 'type', entity: 'Type', title: '类型' },
      { path: 'category', entity: 'Category', title: '分类' },
      { path: 'option', entity: 'Option', title: '配置' }
    ]
  }
]

export default dynamicRoutes

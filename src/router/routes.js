import { entityPrefix } from '@/settings'

const userRoutes = []

const adminRoutes = [
  {
    path: 'appointment',
    entity: 'Appointment',
    title: 'appointment',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'business',
    entity: 'Business',
    title: 'business',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'canteen',
    entity: 'Canteen',
    title: 'canteen',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'dining',
    entity: 'Dining',
    title: 'dining',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'phase',
    entity: 'Phase',
    title: 'phase',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'staff',
    entity: 'Staff',
    title: 'staff',
    icon: 'el-icon-s-custom'
  }
]

const baseRoutes = [
  {
    path: 'user',
    title: '用户管理',
    icon: 'el-icon-user-solid',
    children: [
      { path: '', entity: 'User', title: '用户权限' },
      { path: 'profile', entity: 'UserProfile', title: '用户资料' }
    ]
  },
  // {
  //   path: 'feedback',
  //   entity: 'Feedback',
  //   title: '反馈管理',
  //   icon: 'el-icon-document'
  // },
  {
    path: 'content',
    entity: 'Content',
    title: '内容管理',
    icon: 'el-icon-document'
  },
  {
    path: 'pictures',
    title: '图片管理',
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

export default mergeRoutes()

function mergeRoutes() {
  const resultOne = [...adminRoutes, ...baseRoutes].map(e => ({
    role: 'admin',
    ...e
  }))

  const resultTwo = userRoutes.map(e => ({
    role: 'user',
    ...e,
    path: 'user-' + e.path
  }))

  if (entityPrefix) {
    return addPrefix(resultTwo)
  }

  return [...resultOne, ...resultTwo]
}

function addPrefix(arg) {
  return arg.map(e => {
    const result = { ...e }
    if (result.children) {
      result.children = [...addPrefix(result.children)]
    }

    if (result.entity) {
      result.entity = result.entity?.name
        ? { entityPrefix, ...result.entity }
        : { name: result.entity, entityPrefix }
    }

    return result
  })
}

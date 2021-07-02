import { entityPrefix } from '@/settings'

const adminRoutes = [
  {
    path: 'appointment',
    entity: 'Appointment',
    title: '报餐管理',
    icon: 'el-icon-edit-outline'
  },
  {
    path: 'business',
    entity: 'Business',
    title: '企业管理',
    icon: 'el-icon-office-building'
  },
  {
    path: 'canteen',
    entity: 'Canteen',
    title: '饭堂管理',
    icon: 'el-icon-s-shop'
  },
  {
    path: 'dining',
    entity: 'Dining',
    title: '就餐管理',
    icon: 'el-icon-knife-fork'
  },
  {
    path: 'phase',
    entity: 'Phase',
    title: '餐类管理',
    icon: 'el-icon-dish'
  },
  {
    path: 'staff',
    entity: 'Staff',
    title: '员工管理',
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
      { path: 'category', entity: 'Category', title: '分类' }
      // ,{ path: 'option', entity: 'Option', title: '配置' }
    ]
  }
]

const userRoutes = [
  {
    path: 'appointment',
    entity: 'Appointment',
    title: '报餐管理',
    icon: 'el-icon-edit-outline'
  },
  {
    path: 'business',
    component: import('@/views/business'),
    title: '企业设置',
    icon: 'el-icon-office-building'
  },
  {
    path: 'canteen',
    entity: 'Canteen',
    title: '饭堂管理',
    icon: 'el-icon-s-shop'
  },
  {
    path: 'dining',
    entity: 'Dining',
    title: '就餐管理',
    icon: 'el-icon-knife-fork'
  },
  {
    path: 'phase',
    entity: 'Phase',
    title: '餐类管理',
    icon: 'el-icon-dish'
  },
  {
    path: 'staff',
    entity: 'Staff',
    title: '员工管理',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'content',
    entity: 'Content',
    title: '饭堂公告',
    icon: 'el-icon-document'
  },
  {
    path: 'album',
    component: import('@/views/business/album'),
    title: '相册管理',
    icon: 'el-icon-picture'
  }
]

export default mergeRoutes()

function mergeRoutes() {
  const adminRoutesModify = [...adminRoutes, ...baseRoutes].map(e => ({
    role: 'admin',
    ...e
  }))

  return [...adminRoutesModify, ...userRoutesModify()]
}

function userRoutesModify() {
  const result = userRoutes.map(e => ({
    role: 'user',
    ...e,
    path: 'user-' + e.path
  }))

  return addPrefix(result)
}

function addPrefix(arr) {
  const prefix = entityPrefix || 'api'

  return arr.map(e => {
    const result = { ...e }
    if (result.children) {
      result.children = [...addPrefix(result.children)]
    }

    if (result.entity) {
      result.entity = result.entity?.name
        ? { prefix, ...result.entity }
        : { name: result.entity, prefix }
    }

    return result
  })
}

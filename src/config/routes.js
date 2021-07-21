const adminRoutes = [
  {
    path: 'order',
    entity: 'Order',
    title: '订单',
    icon: 'el-icon-s-order'
  },
  {
    path: 'provider',
    entity: 'Provider',
    title: '服务商',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'region-special-price',
    entity: 'RegionSpecialPrice',
    title: '区域价钱',
    icon: 'el-icon-money'
  },
  {
    path: 'join',
    entity: 'Join',
    title: '服务商申请',
    icon: 'el-icon-document-add'
  },
  {
    path: 'business',
    entity: 'Business',
    title: '商家',
    icon: 'el-icon-s-shop'
  },
  {
    path: 'delivery-sample',
    entity: 'DeliverySample',
    title: '送样',
    icon: 'el-icon-film'
  },
  {
    path: 'worker',
    entity: 'Worker',
    title: '工人',
    icon: 'el-icon-user'
  },
  {
    path: 'coupon',
    title: '优惠券',
    icon: 'el-icon-s-ticket',
    children: [
      { path: '', entity: 'Coupon', title: '优惠券' },
      { path: 'user-coupon', entity: 'UserCoupon', title: '用户优惠券' }
    ]
  },
  {
    path: 'after-sale',
    title: '售后',
    icon: 'el-icon-chat-line-round',
    children: [
      { path: '', entity: 'AfterSale', title: '售后记录' },
      {
        path: 'after-sale-todo',
        entity: { name: 'AfterSale', suffix: 'todo' },
        title: '待处理'
      }
    ]
  }
]

const commonRoutes = [
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
    title: '内容',
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

const dynamicRoutes = {}
// dynamicRoutes property must same as roles
dynamicRoutes.provider = [
  {
    path: 'order',
    entity: 'Order',
    title: '订单',
    icon: 'el-icon-s-order'
  },
  // {
  //   path: 'region-special-price',
  //   entity: 'RegionSpecialPrice',
  //   title: '区域价钱',
  //   icon: 'el-icon-money'
  // },
  // {
  //   path: 'business',
  //   entity: 'Business',
  //   title: '商家',
  //   icon: 'el-icon-s-shop'
  // },
  {
    path: 'delivery-sample',
    entity: 'DeliverySample',
    title: '送样',
    icon: 'el-icon-film'
  },
  {
    path: 'worker',
    entity: 'Worker',
    title: '工人',
    icon: 'el-icon-user'
  },
  {
    path: 'after-sale',
    title: '售后',
    icon: 'el-icon-chat-line-round',
    children: [
      { path: '', entity: 'AfterSale', title: '售后记录' },
      {
        path: 'after-sale-todo',
        entity: { name: 'AfterSale', suffix: 'todo' },
        title: '待处理'
      }
    ]
  }
]

export default mergeRoutes()

function mergeRoutes() {
  const adminRoutesModify = [...adminRoutes, ...commonRoutes].map(e => ({
    role: 'admin',
    ...e
  }))

  return [...adminRoutesModify, ...dynamicRoutesModify()]
}

function dynamicRoutesModify() {
  const result = []
  for (const key in dynamicRoutes) {
    dynamicRoutes[key].forEach(e => {
      result.push({
        role: key,
        ...addPrefix(key, e),
        path: `${key}-` + e.path
      })
    })
  }

  return result
}

function addPrefix(prefix, route) {
  const result = { ...route }
  if (result.path) result.path = `${prefix}-` + result.path

  if (result.entity) {
    result.entity = result.entity?.name
      ? { prefix, ...result.entity }
      : { name: result.entity, prefix }
  }

  if (result.children) {
    result.children = result.children.map(e => addPrefix(prefix, e))
  }

  return result
}

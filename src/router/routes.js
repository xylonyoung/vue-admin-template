import { permissionPrefix } from '@/settings'

const routes = [
  {
    path: 'order',
    entity: 'Order',
    title: '订单管理',
    icon: 'el-icon-s-order'
  },
  {
    path: 'provider',
    entity: 'Provider',
    title: '服务商管理',
    icon: 'el-icon-s-custom'
  },
  {
    path: 'region-special-price',
    entity: 'RegionSpecialPrice',
    title: '区域价钱管理',
    icon: 'el-icon-money'
  },
  {
    path: 'join',
    entity: 'Join',
    title: '服务商申请管理',
    icon: 'el-icon-document-add'
  },
  {
    path: 'business',
    entity: 'Business',
    title: '商家管理',
    icon: 'el-icon-s-shop'
  },
  {
    path: 'delivery-sample',
    entity: 'DeliverySample',
    title: '送样管理',
    icon: 'el-icon-film'
  },
  {
    path: 'worker',
    entity: 'Worker',
    title: '工人管理',
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
        entity: { name: 'AfterSale', suffix: '/todo' },
        title: '待处理'
      }
    ]
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
  {
    path: 'content',
    title: '内容管理',
    icon: 'el-icon-document',
    children: [
      { path: '', entity: 'Content', title: '内容' }
      // { path: 'feedback', entity: 'Feedback', title: '反馈' }
    ]
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
  if (permissionPrefix) {
    return addPrefix(routes, permissionPrefix)
  }
  return [...routes, ...baseRoutes]
}

function addPrefix(arr, prefix) {
  return arr.map(e => {
    const result = { ...e }
    if (result.children) {
      result.children = [...addPrefix(result.children, prefix)]
    }
    if (result.entity) {
      result.entity = result.entity?.name
        ? { prefix, ...result.entity }
        : { name: result.entity, prefix }
    }
    return result
  })
}

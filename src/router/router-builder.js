import Layout from '@/layout'

export function routerBuilder(list) {
  return list.map(e => {
    const result = {
      component: Layout,
      path: `/${e.path}`,
      meta: {}
    }

    if (e.children) {
      result.meta.icon = e.icon
      result.meta.title = e.title
      result.children = [...childrenBuilder(e.children)]
    } else {
      result.children = [...childrenBuilder([e], true)]
    }
    return result
  })
}

function childrenBuilder(children, noChildren) {
  return children.map(e => {
    const result = {
      path: noChildren ? '' : e.path,
      name: e.title,
      component: () => e.component ?? import('@/views/base-view'),
      meta: {
        entity: e.entity,
        title: e.title,
        icon: e.icon
      }
    }
    if (e.children) {
      result.children = [...childrenBuilder(e.children)]
    }
    return result
  })
}

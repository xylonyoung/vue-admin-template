import Layout from '@/layout'

export function routeProcess(dynamicRoutes) {
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

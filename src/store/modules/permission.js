import { constantRoutes } from '@/router'
import { routerBuilder } from '@/router/router-builder'
import asyncRoutes from '@/router/routes'
import store from '@/store'
import { getRole } from '@/utils/auth'
import { needPermission } from '@/settings'

const state = {
  routes: []
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = routeFilter()
      store.commit('user/SET_HAS_PERMISSION', true)
      commit('SET_ROUTES', [...constantRoutes, ...accessedRoutes])
      resolve(accessedRoutes)
    })
    function routeFilter() {
      let result = asyncRoutes.filter(e => e.role === getRole())

      if (needPermission.length > 0) {
        const permissions = store.getters.user?.permissions ?? []
        result = result.filter(e => permissions.includes(e.path))
      }

      return [
        ...routerBuilder(result),
        // 404,page,must be placed at the end !!!
        {
          path: '*',
          redirect: '/404',
          hidden: true
        }
      ]
    }
  }
}

export default {
  state,
  actions
}

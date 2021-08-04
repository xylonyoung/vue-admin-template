import { constantRoutes } from '@/router'
import { routerBuilder, routeProcess } from '@/utils/router'
import dynamicRoutes from '@/config/routes'
import store from '@/store'
import { getRole } from '@/utils/auth'
import { hasPermission } from '@/config'

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
      let result = routeProcess(dynamicRoutes).filter(e => e.role === getRole())

      if (hasPermission) {
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

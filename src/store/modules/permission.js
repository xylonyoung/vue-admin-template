import { constantRoutes } from '@/router'
import { routerBuilder } from '@/router/router-builder'
import asyncRoutes from '@/router/routes'
import store from '@/store'
import { permissionPrefix } from '@/settings'

const state = {
  routes: []
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = filterRoutes()
      store.commit('user/SET_HAS_PERMISSION', true)
      commit('SET_ROUTES', [...constantRoutes, ...accessedRoutes])
      resolve(accessedRoutes)
    })
    function filterRoutes() {
      let routes
      if (permissionPrefix) {
        const permissions = store.getters.user?.permissions ?? []
        routes = asyncRoutes.filter(e => permissions.includes(e.path))
      } else {
        routes = asyncRoutes
      }
      return [
        ...routerBuilder(routes),
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

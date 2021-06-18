import $api from '@/utils/request'
const getDefaultEntities = () => {
  return {
    entities: sessionStorage.getItem('entities') || [],
    structures: sessionStorage.getItem('structures') || {}
  }
}
const state = getDefaultEntities()

const actions = {
  resetEntities({ commit }) {
    sessionStorage.removeItem('entities')
    sessionStorage.removeItem('structures')
    commit('SET_ENTITIES', [])
    commit('SET_STRUCTURES', {})
  },
  async getEntities({ commit }) {
    const res = await $api.get('/system/entities')
    const result = res?.data?.map(e => e.replace(/\\\\/g, '\\')) ?? []
    commit('SET_ENTITIES', result)
    return result
  },
  async getStructure({ commit, state }, entityName) {
    const res = await $api.get('/system/entities/' + entityName)
    const result = { ...state.structures }
    result[entityName] = res?.data ?? {}
    commit('SET_STRUCTURES', result)
    return result
  },
  async checkEntity({ dispatch, state }, entity) {
    if (state.entities.length === 0) await dispatch('getEntities')

    const entityName = entity?.name ?? entity
    const fullEntityName = state.entities.find(e => e.includes(entityName))

    if (fullEntityName in state.structures) return

    await dispatch('getStructure', fullEntityName)
    return
  }
}

export default {
  state,
  actions
}

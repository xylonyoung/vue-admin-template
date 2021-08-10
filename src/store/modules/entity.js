import $request from '@/utils/request'

const state = getDefaultEntities()

const actions = {
  resetEntities({ commit }) {
    sessionStorage.removeItem('entities')
    sessionStorage.removeItem('structures')
    commit('SET_ENTITIES', [])
    commit('SET_STRUCTURES', {})
  },
  async getEntities({ commit }) {
    const res = await $request.get('/system/entities')
    const result = res?.data ?? []
    commit('SET_ENTITIES', result)
    sessionStorage.setItem('entities', JSON.stringify(result))
    return result
  },
  async getStructure({ commit, state }, entityName) {
    const res = await $request.get('/system/entities/' + entityName)
    const result = { ...state.structures }
    result[entityName] = res?.data ?? {}
    commit('SET_STRUCTURES', result)
    sessionStorage.setItem('structures', JSON.stringify(result))
    return result[entityName]
  },
  async getEntity({ dispatch, state }, entity) {
    if (state.entities.length === 0) await dispatch('getEntities')

    const regex = new RegExp('Entity\\\\' + (entity?.name ?? entity) + '$')
    const fullEntityName = state.entities.find(e => regex.test(e))
    let result
    if (fullEntityName in state.structures) {
      result = state.structures[fullEntityName]
    } else {
      result = await dispatch('getStructure', fullEntityName.replace(/\\\\/g, '\\'))
    }

    return result
  }
}

export default {
  state,
  actions
}

function getDefaultEntities() {
  return {
    entities: getSessionStorage('entities') || [],
    structures: getSessionStorage('structures') || {}
  }
}

function getSessionStorage(key) {
  let result
  try {
    result = JSON.parse(sessionStorage.getItem(key))
  } catch (error) {
    console.error(error)
  }
  return result
}

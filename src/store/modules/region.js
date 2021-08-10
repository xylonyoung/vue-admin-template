import $request from '@/utils/request'

const state = {
  list: [],
  waiting: {}
}

const actions = {
  async getRegion({ commit, dispatch, state }, id) {
    let result = state.list.find(e => e.id === id)
    if (!result) {
      const waiting = { ...state.waiting }
      if (waiting[id]) {
        const { data } = await waiting[id]
        result = data ?? {}
      } else {
        waiting[id] = $request.get('/api/uni-regions/' + id)
        commit('SET_WAITING', waiting)
        const { data } = await waiting[id]
        result = data ?? {}
        dispatch('mergeRegion', { region: result })
      }
    }
    return result
  },
  async getRegions({ dispatch, state }, { node, resolve }) {
    const { level, value } = node
    const index = state.list.findIndex(e => e.id === value)
    let result
    if (!value) {
      await $request
        .get('/api/uni-regions', {
          params: { '@filter': 'entity.getParent() == null' }
        })
        .then(res => {
          result = res?.data ?? []
          dispatch('mergeRegion', { region: result })
        })
    } else if (state.list?.[index]?.checked || level > 2) {
      // checked just a flag means that this list was loaded.
      result = state.list.filter(e => e.parent?.id === value)
    } else {
      await $request
        .get('/api/uni-regions', {
          params: { '@filter': 'entity.getParent().getId() == ' + value }
        })
        .then(res => {
          result = res?.data ?? []
          dispatch('mergeRegion', { region: result, checkedId: value })
        })
    }

    resolve(formatResult(result))

    function formatResult(list) {
      return list.map(e => ({
        leaf: level >= 2,
        value: e.id,
        label: e.name
      }))
    }
  },
  mergeRegion({ commit, state }, { region, checkedId }) {
    if (Array.isArray(region)) {
      const result = [...state.list]
      if (checkedId) {
        const index = result.findIndex(e => e.id === checkedId)
        result.splice(index, 1, { ...result[index], checked: true })
      }
      region.forEach(e => {
        if (!result.some(i => i.id === e.id)) {
          result.push(e)
        }
      })

      commit('SET_LIST', result)

      return
    }

    if (!state.list.some(e => e.id === region.id)) {
      commit('SET_LIST', [...state.list, region])
    }
  }
}

export default {
  state,
  actions
}

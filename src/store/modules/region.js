import $api from '@/utils/request'

const state = {
  list: []
}

const actions = {
  async getRegion({ dispatch, state }, id) {
    let result = state.list.find(e => e.id === id)
    if (!result) {
      const { data } = await $api.get('/api/uni-regions/' + id)
      result = data ?? {}
      dispatch('mergeRegion', result)
    }
    return result
  },
  async getRegions({ dispatch, state }, { node, resolve }) {
    const { level, value } = node
    const index = state.list.findIndex(e => e.id === value)
    let result
    if (!value) {
      await $api
        .get('/api/uni-regions', {
          params: { '@filter': 'entity.getParent() == null' }
        })
        .then(res => {
          result = res?.data ?? []
          dispatch('mergeRegion', result)
        })
    } else if (state.list?.[index]?.checked) {
      // checked just a flag means that this list was loaded.
      result = state.list.filter(e => e.parent?.id === value)
    } else {
      await $api
        .get('/api/uni-regions', {
          params: { '@filter': 'entity.getParent().getId() == ' + value }
        })
        .then(res => {
          result = res?.data ?? []
          dispatch('mergeRegion', result, value)
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
  mergeRegion({ commit, state }, region, checkedId) {
    console.log(checkedId);
    if (Array.isArray(region)) {
      const result = [...state.list]
      if (checkedId) {
        const index = result.findIndex(e => e.id === checkedId)
        result.splice(index, 1, { ...result[index], checked: true })
        console.log(result[index])
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

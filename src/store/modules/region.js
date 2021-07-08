import $api from '@/utils/request'

const state = {
  list: [],
  isLoadingList: false
}

const actions = {
  async getRegionList({ commit, state }) {
    if (state.isLoadingList) return
    commit('SET_IS_LOADING_LIST', true)
    const { data } = await $api.get('/manage/uni-regions')
    const result = data ?? []
    commit('SET_LIST', result)
    return result
  },
  getRegions({ state }, { node, resolve }) {
    const { level, value } = node
    const result = state.list.filter(checkout).map(e => ({
      leaf: level >= 2,
      value: e.id,
      label: e.name
    }))
    resolve(result)
    function checkout(item) {
      return value ? item.parent?.id === value : item.parent === null
    }
  }
}

export default {
  state,
  actions
}

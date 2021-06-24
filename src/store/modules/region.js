import $api from '@/utils/request'

const state = {
  regionList: [],
  isLoadingRegionList: false
}

const actions = {
  async getRegionList({ commit, state }) {
    if (state.isLoadingRegionList) return
    commit('SET_IS_LOADING_REGION_LIST', true)
    const { data } = await $api.get('/manage/uni-regions')
    const result = data ?? []
    commit('SET_REGION_LIST', result)
    return result
  },
  getRegions({ state }, { node, resolve }) {
    const { level, value } = node
    const result = state.regionList.filter(checkout).map(e => ({
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

export default {
  namespaced: true,
  state: {
    goods: [],
    searchText: '',
    searchHeader: 'name',
    sortedByName: false,
    headers: [
      { name: 'Наименование', value: 'name' },
      { name: 'Количество', value: 'count' },
      { name: 'Ед. измерения', value: 'unit' },
    ],
    units: [
      { name: 'шт.', value: 0 },
      { name: 'кг', value: 1 },
      { name: 'бан.', value: 2 },
    ]
  },
  getters: {
    goods (state, _, rootState) {
      return state.goods
        .filter(it => it.listId === rootState.lists.selectedListId)
        .filter(it => String(state.searchHeader === 'unit' ? state.units[it[state.searchHeader]].name : it[state.searchHeader])
        .toLowerCase().includes(state.searchText.toLowerCase()) && it)
        .sort((a, b) => state.sortedByName && (a.name !== b.name ? a.name < b.name ? -1 : 1 : 0))
        .sort((a, b) => (a.bought === b.bought) ? 0 : b.bought ? -1 : 1)
    }
  },
  mutations: {
    setGoods (state, goods) {
      state.goods = goods
    },
    setSearchText (state, searchText) {
      state.searchText = searchText
    },
    setSearchHeader (state, selected) {
      state.searchHeader = selected
    },
    setSortedByName (state, boolean) {
      state.sortedByName = boolean
    }
  },
  actions: {
    async getGoods ({ commit }) {
      let goods = await (localStorage.getItem('goods') && JSON.parse(localStorage.getItem('goods'))) || []
      commit('setGoods', goods)
    },
    async setGoods({ commit}, goods) {
      await localStorage.setItem('goods', JSON.stringify(goods))
      commit('setGoods', goods)
    },
    createGoodsItem({ state, dispatch, rootState }, { goodsItemName, goodsItemCount, goodsItemUnit }) {
      let goods = [{
        id: Math.random().toString(32).slice(2),
        name: goodsItemName,
        count: goodsItemCount,
        unit: goodsItemUnit,
        bought: false,
        listId: rootState.lists.selectedListId
      }, ...state.goods]
      dispatch('setGoods', goods)
    },
    updateGoodsItem ({ state, dispatch }, { updatingGoodsItemName, updatingGoodsItemCount, updatingGoodsItemUnit, updatingGoodsItemId }) {
      let goods = state.goods.slice()
      goods.find(it => {
        if (it.id === updatingGoodsItemId) {
          it.name = updatingGoodsItemName
          it.count = updatingGoodsItemCount
          it.unit = updatingGoodsItemUnit
        }
      })
      dispatch('setGoods', goods)
    },
    updateGoodsItemBought ({ state, dispatch }, goodsItem) {
      let goods = state.goods.slice()
      goods.find(it => it.id === goodsItem.id).bought = !goodsItem.bought
      dispatch('setGoods', goods)
    },
    deleteGoodsItem({ state, dispatch }, goodsItemId) {
      let goods = state.goods.slice().filter(it => it.id !== goodsItemId)
      dispatch('setGoods', goods)
    },
    deleteGoodsItemByListId({ state, dispatch }, listId) {
      let goods = state.goods.slice().filter(it => it.listId !== listId)
      dispatch('setGoods', goods)
    },

    async updateSearch ({ commit }, searchText) {
      await localStorage.setItem('searchText', searchText)
      commit('setSearchText', searchText)
    },
    async updateSearchHeader ({ commit }, searchHeader) {
      await localStorage.setItem('searchHeader', searchHeader)
      commit('setSearchHeader', searchHeader)
    },
    async updateSortedByName ({ commit }, boolean) {
      await localStorage.setItem('sortedByName', boolean)
      commit('setSortedByName', boolean)
    }
  }
}
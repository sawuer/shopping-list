export default {
  namespaced: true,
  state: {
    lists: [],
    selectedListId: null
  },
  mutations: {
    setLists (state, lists) {
      state.lists = lists
    },
    setSelectedListId (state, selectedListId) {
      state.selectedListId = selectedListId
    }
  },
  actions: {
    getLists({ commit }) {
      let lists = (localStorage.getItem('lists') && JSON.parse(localStorage.getItem('lists'))) || []
      commit('setLists', lists)
    },
    setLists({ commit }, lists) {
      localStorage.setItem('lists', JSON.stringify(lists))
      commit('setLists', lists)
    },
    createList({ state, dispatch }, name) {
      let lists = [
        ...state.lists, 
        { id: Math.random().toString(32).slice(2), name }
      ]
      dispatch('setLists', lists)
    },
    updateList({ state, dispatch }, { updatingListId, updatingListName }) {
      let lists = state.lists.slice()
      lists.find(it => {
        if (it.id === updatingListId) {
          it.name = updatingListName
        }
      })
      dispatch('setLists', lists)
    },
    deleteList({ state, dispatch }, listId) {
      let lists = state.lists.slice().filter(it => it.id !== listId)
      dispatch('setLists', lists)
      dispatch('goods/deleteGoodsItemByListId', listId, { root: true })
    },
    selectList ({ state, commit }, selectedListId) {
      let listId = selectedListId === state.selectedListId ? null : selectedListId
      localStorage.setItem('selectedListId', listId)
      commit('setSelectedListId', listId)
    },
  }
}

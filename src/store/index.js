import Vue from 'vue'
import Vuex from 'vuex'
import goods from './modules/goods'
import lists from './modules/lists'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    goods,
    lists
  }
})

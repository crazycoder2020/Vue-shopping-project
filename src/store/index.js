import Vue from 'vue'
import Vuex from 'vuex'


import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

//对外输出
export default new Vuex.Store({
    state,
    mutations,
    actions
});
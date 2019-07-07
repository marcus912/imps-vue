import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    domain: process.env.API_URL,
    version: '',
    userInfo: {
      userId: '',
      userName: '',
      realName: '',
      indexPage: '',
      guuserName: '',
      isStoreEmpty: '',
      isManual: ''
    }
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userInfo = payload.userInfo
    },
    setVersion (state, payload) {
      state.version = payload.version
    },
    setDomain (state, payload) {
      state.domain = payload.API_URL
      console.log(payload)
    }
  },
  actions: {
    updateUserInfo ({commit}, userInfo) {
      commit('setUserInfo', userInfo)
    },
    updateVersion ({commit}, version) {
      commit('setVersion', version)
    },
    initDomain ({commit}, API_URL) {
      commit('setDomain', API_URL)
    }
  },
  plugins: [
    vuexLocal.plugin
  ]
})

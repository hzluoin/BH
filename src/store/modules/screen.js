const state = {
  width: 0,
  height: 0
}

const getters = {
  getScreenWidth: state => {
    return state.width
  },
  getScreenHeight: state => {
    return state.height
  }
}

const mutations = {
  setScreenWidth: (state, width) => {
    state.width = width
  },
  setScreenHeight: (state, height) => {
    state.height = height
  }
}

const actions = {

}

export default {
  state,
  getters,
  actions,
  mutations
}

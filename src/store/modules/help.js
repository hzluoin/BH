import Vue from 'vue'
const state = {
  // 源数据
  // [
  //   [
  //     {
  //       category: '常见问题',
  //       categoryId: 100018,
  //       hasMore: false,
  //       helps: [
  //         [
  //           {'id': 50037, 'type': '2', 'title': '发布广告'},
  //           {'id': 50036, 'type': '2', 'title': '关于币汇场外交易操作（包含买入和卖出货币等详细说明）（PC端）'}
  //         ]
  //       ]
  //     }
  //   ]
  // ]
  // 改造后数据
  // {
  //   [
  //     {
  //       category: '常见问题',
  //       categoryId`: 100018,
  //       hasMore: false,
  //       helps: [
  //         [
  //           {'id': 50037, 'type': '2', 'title': '发布广告'},
  //           {'id': 50036, 'type': '2', 'title': '关于币汇场外交易操作（包含买入和卖出货币等详细说明）（PC端）'}
  //         ]
  //       ]
  //     }
  //   ]
  // }
  category: [
    [
      {
        category: '常见问题',
        categoryId: 100018,
        hasMore: false,
        helps: [
          [
            {'id': 50037, 'type': '2', 'title': '发布广告'},
            {'id': 50036, 'type': '2', 'title': '关于币汇场外交易操作（包含买入和卖出货币等详细说明）（PC端）'}
          ]
        ]
      }
    ]
  ]
}

const getters = {
}

const mutations = {
  setSecondCategory: (state, {type, category}) => {
    state.secondCategory[type] = category
  }
}

const actions = {
  qrySecondCategory ({commit, dispatch}, type) {
    // 1: '公告中心'
    // 2: '帮助中心'
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/help/listUI',
        data: {
          type: type
        }
      }).then(response => {
        commit('setSecondCategory', {
          type: type,
          category: response.body.data
        })
        resolve(response)
      }, response => {
        reject(response)
        switch (response.body.code) {
          case 666:
            return
          default:
            Vue.$message.error(response.body.msg)
        }
      })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

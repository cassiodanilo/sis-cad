import axios from 'axios'

const state = {
  user: null,
  clients: [],
  loading: false
}

const getters = {
  isAuthenticated: state => !!state.user,
  StateClients: state => state.clients,
  StateUser: state => state.user,
  loading: state => state.loading
}

const actions = {
  async Register({ dispatch }, form) {
    await axios.post('register', form)
    let UserForm = new FormData()
    UserForm.append('username', form.username)
    UserForm.append('password', form.password)
    await dispatch('LogIn', UserForm)
  },
  async LogIn({ commit }, user) {
    commit('setLoading', true)
    await axios.post('login', user)
      .then(function (response) {
        let data = response.data
        commit('setUser', data)
        commit('setLoading', false)
      }).finally(() => commit('setLoading', false))
  },
  async CreateClient({ dispatch, state }, client) {
    await axios.post('clientes', client, {
      headers: {
        'Authorization': `Bearer ${state.user.accessToken}`
      }
    })
    await dispatch('GetClients')
  },
  async UpdateClient({ dispatch, state }, client) {
    await axios.put(`clientes/${client.id}`, client, {
      headers: {
        'Authorization': `Bearer ${state.user.accessToken}`
      }
    })
    await dispatch('GetClients')
  },
  async RemoveClient({ dispatch, state }, client) {
    await axios.delete(`clientes/${client.id}`, {
      headers: {
        'Authorization': `Bearer ${state.user.accessToken}`
      }
    })
    await dispatch('GetClients')
  },
  async GetClients({ commit, state }) {
    let response = await axios.get('clientes', {
      headers: {
        'Authorization': `Bearer ${state.user.accessToken}`
      }
    })
    commit('setClients', response.data)
  },
  async LogOut({ commit }) {
    let user = null
    commit('LogOut', user)
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setClients(state, clients) {
    state.clients = clients
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  LogOut(state) {
    state.user = null
    state.clients = []
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
